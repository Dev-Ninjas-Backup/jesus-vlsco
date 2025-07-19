import { Injectable } from '@nestjs/common';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private readonly prisma: PrismaService) {}

    async getCompanyWithBranches() {
        const company = await this.prisma.companies.findMany({
            include: {
                branches: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                        managerId: true, 
                    },
                    include:{
                        manager:true
                    }
                }, 
            },
        });

        if (!company) {
            throw new Error('Companies not found');
        }

        return successResponse(company, 'Companies and branches retrieved successfully');
    }
}
