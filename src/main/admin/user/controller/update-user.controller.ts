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
import { FileService } from '@project/lib/file/file.service';
import { FileType, MulterService } from '@project/lib/multer/multer.service';
import { updateUserSwaggerSchema } from '../dto/add-user.swagger';
import { UpdateFullUserDto } from '../dto/update-full-user.dto';
import { UpdateProfileDto, UpdateRoleDto } from '../dto/update-profile.dto';
import { UpdateFullUserService } from '../services/update-full-user.service';
import { UpdateUserService } from '../services/update-user.service';

@ApiTags('Admin -- User')
@Controller('admin/user')
@ValidateAdmin()
@ApiBearerAuth()
export class UpdateUserController {
  constructor(
    private readonly updateUserService: UpdateUserService,
    private readonly fileService: FileService,
    private readonly updateFullUserService: UpdateFullUserService,
  ) {}

  @Patch(':userId')
  @ApiOperation({
    summary: 'Update an existing user with optional new profile photo',
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
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl: string | null = null;
    if (file) {
      uploadedUrl = (await this.fileService.processUploadedFile(file)).url;
    }
    return this.updateUserService.updateUser(userId, dto, uploadedUrl);
  }

  @Patch(':userId/full')
  @ApiOperation({
    summary: 'Update an existing user with optional new profile photo',
  })
  async updateFullUser(
    @Param('userId') userId: string,
    @Body() dto: UpdateFullUserDto,
  ) {
    return this.updateFullUserService.updateFullUser(userId, dto);
  }

  @Patch(':userId/role')
  async changeUserRole(
    @Param('userId') userId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.updateUserService.changeUserRole(userId, dto.role);
  }
}
