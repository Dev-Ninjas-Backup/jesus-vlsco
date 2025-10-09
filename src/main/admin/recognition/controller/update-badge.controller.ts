import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { FileService } from '@project/lib/file/file.service';
import { UpdateBadgeDto } from '../dto/add-badge.dto';
import { addBadgeSwaggerSchema } from '../dto/add-badge.swagger';
import { UpdateBadgeService } from '../services/update-badge.service';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class UpdateBadgeController {
  constructor(
    private readonly fileService: FileService,
    private readonly updateBadgeService: UpdateBadgeService,
  ) {}

  @Patch('badge-update/:id')
  @UseInterceptors(FileInterceptor('iconImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Badge creation with icon image',
    schema: {
      type: 'object',
      properties: {
        ...addBadgeSwaggerSchema.properties,
        iconImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateBadg(
    @Param('id') id: string,
    @Body() dto: UpdateBadgeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl;
    if (file) {
      uploadedUrl = await this.fileService.processUploadedFile(file);
    }
    return await this.updateBadgeService.updateBadge(
      id,
      dto,
      uploadedUrl?.url || null,
    );
  }

  // Delete Badge by ID
  @Delete('badge-delete/:id')
  async deleteBadge(@Param('id') id: string) {
    return await this.updateBadgeService.deleteBadge(id);
  }
}
