import {
  Body,
  Controller,
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
}
