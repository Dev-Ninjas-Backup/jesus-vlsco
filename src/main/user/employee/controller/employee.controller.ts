import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
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
import { GetUsersDto } from '@project/main/admin/user/dto/get-users.dto';
import { GetUserService } from '@project/main/admin/user/services/get-user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { updateProfileSwaggerSchema } from '../dto/update-profile.swagger';
import { EmployeeService } from '../services/employee.service';

@ApiTags('Employee -- Update employee profile')
@Controller('employee/user')
@ValidateEmployee()
@ApiBearerAuth()
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly getUserService: GetUserService,
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Update employee profile by employee',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: updateProfileSwaggerSchema.properties,
    },
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
    return this.employeeService.updateProfile(userId, dto, uploadedUrl);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users with optional filters, search, and pagination',
  })
  async getAllUsers(@Query() query: GetUsersDto) {
    return await this.getUserService.getAllUsers(query);
  }
}
