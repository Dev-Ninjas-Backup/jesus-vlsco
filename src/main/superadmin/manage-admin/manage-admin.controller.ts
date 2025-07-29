import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateSuperAdmin } from '@project/common/jwt/jwt.decorator';
import { TResponse } from '@project/common/utils/response.util';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ManageAdminService } from './manage-admin.service';
import { PaginationDto } from '@project/common/dto/pagination.dto';

@ApiTags('Superadmin -- Manage Admin')
@ValidateSuperAdmin()
@ApiBearerAuth()
@Controller('superadmin/manage-admin')
export class ManageAdminController {
  constructor(private readonly manageAdminService: ManageAdminService) {}

  @Post('create-admin')
  async createAdmin(@Body() dto: CreateAdminDto): Promise<TResponse<any>> {
    return await this.manageAdminService.createAdmin(dto);
  }

  @Get('get-admins')
  async getAdmins(@Query() query: PaginationDto): Promise<TResponse<any>> {
    return await this.manageAdminService.getAdmins(query);
  }

  @Get(':adminId')
  async getAAdmin(@Param('adminId') adminId: string): Promise<TResponse<any>> {
    return await this.manageAdminService.getAAdmin(adminId);
  }

  @Delete(':adminId')
  async deleteAdmin(
    @Param('adminId') adminId: string,
  ): Promise<TResponse<any>> {
    return await this.manageAdminService.deleteAdmin(adminId);
  }
}
