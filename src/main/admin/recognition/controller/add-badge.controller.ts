import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { FileService } from '@project/lib/file/file.service';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
import { AddBadgeDto } from '../dto/add-badge.dto';
import { addBadgeSwaggerSchema } from '../dto/add-badge.swagger';
import { AddBadgeService } from '../services/add-badge.service';

@ApiTags('Admin -- Recognition')
@Controller('admin/recognition')
@ValidateAdmin()
@ApiBearerAuth()
export class AddBadgeController {
  constructor(
    private readonly fileService: FileService,
    private readonly addBadgeService: AddBadgeService,
  ) {}

  @Post('add-badge')
  @UseInterceptors(
    FileInterceptor(
      'iconImage',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
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
      required: ['title', 'category', 'iconImage'],
    },
  })
  async addBadge(
    @Body() dto: AddBadgeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Image file (iconImage) is required.');
    }

    const uploadedUrl = await this.fileService.processUploadedFile(file);

    return await this.addBadgeService.addBadge(dto, uploadedUrl.url);
  }
}
