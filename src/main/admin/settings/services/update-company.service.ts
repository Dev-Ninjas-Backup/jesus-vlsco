import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateCompanyWithBranchesDto } from '../dto/updateCompany.dto';

@Injectable()
export class UpdateCompanyService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update company')
  async updateCompanyWithBranches(
    companyId: string,
    dto: UpdateCompanyWithBranchesDto,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Check if the company exists
      const existingCompany = await tx.companies.findUnique({
        where: { id: companyId },
        include: { branches: true },
      });

      if (!existingCompany) {
        throw new AppError(404, 'Company not found');
      }

      // Step 2: Update the company fields if provided
      await tx.companies.update({
        where: { id: companyId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.location && { location: dto.location }),
        },
      });

      // Step 3: Prepare branch IDs from request DTO
      const dtoBranchIds =
        dto.branches?.map((b) => b.id).filter((id) => id !== undefined) ?? [];

      // Step 4: Delete branches not included in the DTO
      // (existing branches that are not in dtoBranchIds)
      await tx.companiesBranch.deleteMany({
        where: {
          companyId,
          id: { notIn: dtoBranchIds },
        },
      });

      // Step 5: Upsert branches: update if id exists, create if not
      if (dto.branches?.length) {
        for (const branch of dto.branches) {
          const { id, ...branchData } = branch;

          if (id) {
            // Update existing branch, validate ownership
            const existingBranch = await tx.companiesBranch.findUnique({
              where: { id },
            });

            if (!existingBranch || existingBranch.companyId !== companyId) {
              throw new AppError(
                404,
                `Branch with ID ${id} not found or doesn't belong to this company`,
              );
            }

            await tx.companiesBranch.update({
              where: { id },
              data: branchData,
            });
          } else {
            // Create new branch linked to company
            await tx.companiesBranch.create({
              data: {
                ...branchData,
                companyId,
                name: branchData.name ?? '',
                location: branchData.location ?? '',
                managerId: branchData.managerId ?? '',
              },
            });
          }
        }
      }

      const finalCompany = await tx.companies.findUnique({
        where: { id: companyId },
        include: {
          branches: {
            include: {
              manager: true,
            },
          },
        },
      });

      return successResponse(
        finalCompany,
        'Company and branches updated successfully',
      );
    });
  }
}
