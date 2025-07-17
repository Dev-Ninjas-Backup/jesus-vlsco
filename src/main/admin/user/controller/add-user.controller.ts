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
import { Roles } from '@project/common/jwt/jwt.decorator';
import { RolesGuard } from '@project/common/jwt/jwt.guard';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddUserDto } from '../dto/add-user.dto';
import { AddUserService } from '../services/add-user.service';

@ApiTags('Admin')
@Controller('admin/user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserEnum.ADMIN)
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
