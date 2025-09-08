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
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { FileService } from '@project/lib/file/file.service';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
import { GetUserService } from '@project/main/admin/user/services/get-user.service';
import { UpdateUserService } from '@project/main/admin/user/services/update-user.service';
import {
  UpdateProfileDto,
  updateUserSwaggerSchema,
} from '../dto/update-profile.dto';

@ApiTags('Employee -- Settings')
@Controller('employee/user')
@ValidateAuth()
@ApiBearerAuth()
export class EmployeeController {
  constructor(
    private readonly fileService: FileService,
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
  @UseInterceptors(
    FileInterceptor(
      'profileUrl',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
  async updateUser(
    @GetUser('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;
    if (file) {
      uploadedUrl = (await this.fileService.processUploadedFile(file)).url;
    }
    return this.updateUserService.updateUser(userId, dto, uploadedUrl);
  }

  @Get('me/profile')
  async getMe(@GetUser('userId') userId: string) {
    return this.getUserService.getUserById(userId);
  }
}
