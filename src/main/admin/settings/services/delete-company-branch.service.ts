import { Injectable } from '@nestjs/common';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class DeleteCompanyBranchService {
    constructor(private readonly prisma: PrismaService) {} 

    async deleteBranch(companyId: string, branchId: string) {
        const branch = await this.prisma.companiesBranch.delete({
            where: {
                id: branchId,
                companyId: companyId,
            },
        });

        return successResponse(branch, "Branch deleted successfully");
    }
}
