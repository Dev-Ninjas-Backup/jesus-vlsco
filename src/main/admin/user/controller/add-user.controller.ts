import {
  Body,
  Controller,
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
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserDto } from '../dto/add-user.dto';
import { AddUserService } from '../services/add-user.service';

@ApiTags('Admin')
@Controller('admin/user')
@ValidateAdmin()
@ApiBearerAuth()
export class AddUserController {
  constructor(
    private readonly addUserService: AddUserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User creation form data with profile image',
    schema: {
      type: 'object',
      properties: {
        ...require('../dto/add-user.swagger').swaggerSchema.properties,
        profileUrl: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('profileUrl'))
  async createUser(
    @Body() dto: AddUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // * upload file to Cloudinary
    const uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
      file.buffer,
      file.originalname,
    );

    return this.addUserService.createUserWithProfile(dto, uploadedUrl.url);
  }
}
