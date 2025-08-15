import {
  Body,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { updateUserSwaggerSchema } from '../dto/add-user.swagger';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateUserService } from '../services/update-user.service';

@ApiTags('Admin -- User')
@Controller('admin/user')
@ValidateAdmin()
@ApiBearerAuth()
export class UpdateUserController {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Patch(':userId')
  @ApiOperation({
    summary: 'Update an existing user with optional new profile photo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: updateUserSwaggerSchema.properties },
  })
  @UseInterceptors(FileInterceptor('profileUrl'))
  async updateUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;
    if (file) {
      uploadedUrl = (
        await this.cloudinaryService.uploadImageFromBuffer(
          file.buffer,
          file.originalname,
        )
      ).url;
    }
    return this.updateUserService.updateUser(userId, dto, uploadedUrl);
  }
}
