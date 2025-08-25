import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Employee -- Dashboard & Shifts')
@Controller('employee/dashboard')
@ValidateEmployee()
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get user dashboard' })
  @Get()
  async getUserDashboard(@GetUser('userId') userId: string) {
    return this.dashboardService.getUserDashboard(userId);
  }
}
