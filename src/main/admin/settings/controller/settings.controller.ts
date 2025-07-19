import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateCompanyService } from '../services/create-company.service';
import { CreateCompanyWithBranchDto } from '../dto/createCompany.dto';
import { createCompanyWithBranchSwaggerSchema } from '../dto/createCompany.swagger';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@ApiTags('Admin -- Settings')
@Controller('admin/settings')
@ValidateAdmin()
@ApiBearerAuth()
export class SettingsController {
    constructor(private readonly createCompanyService: CreateCompanyService, //private readonly cloudinaryService: CloudinaryService

    ) {}

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
}
