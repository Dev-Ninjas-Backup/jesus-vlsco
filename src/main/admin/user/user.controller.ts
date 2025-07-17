import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEnum } from '@project/common/enum/user.enum';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserDto } from './dto/add-user.dto';
import { UserService } from './services/add-profile-info.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserEnum.ADMIN)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
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
        ...require('./dto/add-user.swagger').swaggerSchema.properties,
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

    // * save user with uploaded profileUrl
    return {
      message: 'User created successfully',
      data: { ...dto, profileUrl: uploadedUrl },
    };
  }
}
