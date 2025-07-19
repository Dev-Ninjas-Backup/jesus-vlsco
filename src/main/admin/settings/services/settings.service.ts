import { Injectable } from '@nestjs/common';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) {}

    async getCompanyWithBranches() {
        const company = await this.prisma.companies.findMany({
            include: {
                branches: true, // Assuming 'branches' is the relation name in your Prisma schema
            },
        });

        if (!company) {
            throw new Error('Companies not found');
        }

        return successResponse(company, 'Companies and branches retrieved successfully');
    }
}
