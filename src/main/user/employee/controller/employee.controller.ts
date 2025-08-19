import {
  Body,
  Controller,
  Get,
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
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { updateUserSwaggerSchema } from '@project/main/admin/user/dto/add-user.swagger';
import { GetUserService } from '@project/main/admin/user/services/get-user.service';
import { UpdateUserService } from '@project/main/admin/user/services/update-user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@ApiTags('Employee -- Settings')
@Controller('employee/user')
@ValidateEmployee()
@ApiBearerAuth()
export class EmployeeController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly updateUserService: UpdateUserService,
    private readonly getUserService: GetUserService,
  ) {}

  @Patch('profile')
  @ApiOperation({
    summary: 'Update employee profile by employee',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: { type: 'object', properties: updateUserSwaggerSchema.properties },
  })
  @UseInterceptors(FileInterceptor('profileUrl'))
  async updateUser(
    @GetUser('userId') userId: string,
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

  @Get('me/profile')
  async getMe(@GetUser('userId') userId: string) {
    return this.getUserService.getUserById(userId);
  }
}
