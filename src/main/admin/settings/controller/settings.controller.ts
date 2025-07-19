import { Body, Controller, Get, Param, Patch, Post, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateCompanyService } from '../services/create-company.service';
import { CreateCompanyWithBranchDto } from '../dto/createCompany.dto';
import { createCompanyWithBranchSwaggerSchema } from '../dto/createCompany.swagger';
import { UpdateCompanyService } from '../services/update-company.service';
import { UpdateCompanyWithBranchesDto } from '../dto/updateCompany.dto';
import { updateCompanyWithBranchesSwagger } from '../dto/updateCompanyWithBranch.swagger';
import { SettingsService } from '../services/settings.service';

@ApiTags('Admin -- Settings')
@Controller('admin/settings')
@ValidateAdmin()
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly createCompanyService: CreateCompanyService, //
    private readonly updateCompanyService: UpdateCompanyService,
    private readonly getCompanyService: SettingsService, // Assuming you have a service to get company details    
    // private readonly cloudinaryService: CloudinaryService
    ) {}

    @Get('get-companies')
    async getCompanies() {
        return this.getCompanyService.getCompanyWithBranches();
    }

    @Post('create-company')
    @ApiBody({
        description: 'Comapny creation with branches',
        schema: {
            type: 'object',
            properties: {
                ...createCompanyWithBranchSwaggerSchema.properties,
            },
            required: ['name', 'location'],
        },
    })
    async createCompany(@Body() dto: CreateCompanyWithBranchDto,
        // @UploadedFile() file: Express.Multer.File,
    ) {
        // let uploadedUrl;
        // if (file) {
        //         uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        //         file.buffer,
        //         file.originalname,
        //     );
        // }
        return this.createCompanyService.createCompany(dto);
    }

    @Patch('update-company/:companyId')
    @ApiBody({
        description: 'Update company and branches',
        schema: {...updateCompanyWithBranchesSwagger.schema,
            properties:{
                ...updateCompanyWithBranchesSwagger.schema.properties,
            }
        },
    })
    async updateCompany(
        @Param('companyId') companyId: string,
        @Body() dto: UpdateCompanyWithBranchesDto,
        // @UploadedFile() file: Express.Multer.File,
    ) {
        // let uploadedUrl;
        // if (file) {
        //     uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        //         file.buffer,
        //         file.originalname,
        //     );
        // }
        return this.updateCompanyService.updateCompanyWithBranches(companyId,dto);
    }
}
