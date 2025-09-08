import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
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
import { AddUserDto } from '../dto/add-user.dto';
import { swaggerSchema } from '../dto/add-user.swagger';
import { AddUserService } from '../services/add-user.service';

@ApiTags('Admin -- User')
@Controller('admin/user')
@ValidateAdmin()
@ApiBearerAuth()
export class AddUserController {
  constructor(
    private readonly addUserService: AddUserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User creation form data with profile image',
    schema: {
      type: 'object',
      properties: {
        ...swaggerSchema.properties,
        profileUrl: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'profileUrl',
      new MulterService().createMulterOptions('./temp', 'temp', FileType.IMAGE),
    ),
  )
  async createUser(
    @Body() dto: AddUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let uploadedUrl = null;

    if (file) {
      uploadedUrl = await this.fileService.processUploadedFile(file);
    }

    return this.addUserService.createUserWithProfile(
      dto,
      uploadedUrl?.url || null,
    );
  }

  @ApiOperation({ summary: 'Delete a user' })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.addUserService.deleteUser(userId);
  }
}
