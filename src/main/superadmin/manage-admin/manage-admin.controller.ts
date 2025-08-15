import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { TResponse } from '@project/common/utils/response.util';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ManageAdminService } from './manage-admin.service';

@ApiTags('Admin -- Manage Admin')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/manage-admin')
export class ManageAdminController {
  constructor(private readonly manageAdminService: ManageAdminService) {}

  // @Post('create-admin')
  // @ApiOperation({ summary: 'Create a new admin with profile photo' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'User creation form data with profile image',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       ...createAdminSwagger.properties,
  //       profileUrl: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  // @UseInterceptors(FileInterceptor('profileUrl'))
  // async createAdmin(
  //   @Body() dto: CreateAdminDto,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<TResponse<any>> {
  //   let uploadedUrl = null;

  //   if (file) {
  //     uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
  //       file.buffer,
  //       file.originalname,
  //     );
  //   }
  //   return await this.manageAdminService.createAdmin(
  //     dto,
  //     uploadedUrl?.url || null,
  //   );
  // }

  @Get('get-admins')
  async getAdmins(@Query() query: PaginationDto): Promise<TResponse<any>> {
    return await this.manageAdminService.getAdmins(query);
  }

  @Get(':adminId')
  async getAAdmin(@Param('adminId') adminId: string): Promise<TResponse<any>> {
    return await this.manageAdminService.getAAdmin(adminId);
  }

  // @Delete(':adminId')
  // async deleteAdmin(
  //   @Param('adminId') adminId: string,
  // ): Promise<TResponse<any>> {
  //   return await this.manageAdminService.deleteAdmin(adminId);
  // }

  @ApiOperation({ summary: 'Update user password' })
  @Post('me/update-password')
  async getProfile(
    @GetUser('userId') userId: string,
    @Body() body: UpdatePasswordDto,
  ) {
    return this.manageAdminService.updatePassword(userId, body);
  }
}
