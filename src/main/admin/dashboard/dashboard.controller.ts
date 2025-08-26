import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';

@ApiTags('Admin -- Dashboard')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('notifications')
  async getAllNotifications() {
    return this.dashboardService.getAllNotifications();
  }

  @Get('data')
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }
}
