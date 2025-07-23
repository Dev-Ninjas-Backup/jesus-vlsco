import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateCompanyBranchNestedDto } from '../dto/createCompanyBranch.dto';
import { successResponse } from '@project/common/utils/response.util';
import { HandleError } from '@project/common/error/handle-error.decorator';

@Injectable()
export class AddBranchService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to add branch')
  async addBranchToCompany(
    companyId: string,
    branchData: CreateCompanyBranchNestedDto,
  ) {
    const branch = await this.prisma.companiesBranch.create({
      data: {
        ...branchData,
        companyId,
      },
    });

    return successResponse(branch, 'Branch added successfully');
  }
}
