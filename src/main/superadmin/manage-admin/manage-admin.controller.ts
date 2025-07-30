import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateSuperAdmin } from '@project/common/jwt/jwt.decorator';
import { TResponse } from '@project/common/utils/response.util';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ManageAdminService } from './manage-admin.service';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { createAdminSwagger } from './dto/create-admin-swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@ApiTags('Superadmin -- Manage Admin')
@ValidateSuperAdmin()
@ApiBearerAuth()
@Controller('superadmin/manage-admin')
export class ManageAdminController {
  constructor(
    private readonly manageAdminService: ManageAdminService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('create-admin')
  @ApiOperation({ summary: 'Create a new admin with profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User creation form data with profile image',
    schema: {
      type: 'object',
      properties: {
        ...createAdminSwagger.properties,
        profileUrl: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileUrl'))
  async createAdmin(
    @Body() dto: CreateAdminDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TResponse<any>> {
    let uploadedUrl = null;

    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    return await this.manageAdminService.createAdmin(
      dto,
      uploadedUrl?.url || null,
    );
  }

  @Get('get-admins')
  async getAdmins(@Query() query: PaginationDto): Promise<TResponse<any>> {
    return await this.manageAdminService.getAdmins(query);
  }

  @Get(':adminId')
  async getAAdmin(@Param('adminId') adminId: string): Promise<TResponse<any>> {
    return await this.manageAdminService.getAAdmin(adminId);
  }

  @Delete(':adminId')
  async deleteAdmin(
    @Param('adminId') adminId: string,
  ): Promise<TResponse<any>> {
    return await this.manageAdminService.deleteAdmin(adminId);
  }
}
