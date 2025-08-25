import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { DashboardService } from './services/dashboard.service';
import { GetShiftScheduleService } from './services/get-shift-schedule.service';

@ApiTags('Employee -- Dashboard & Shifts')
@Controller('employee/dashboard')
@ValidateEmployee()
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly getShiftScheduleService: GetShiftScheduleService,
  ) {}

  @ApiOperation({ summary: 'Get user dashboard' })
  @Get()
  async getUserDashboard(@GetUser('userId') userId: string) {
    return this.dashboardService.getUserDashboard(userId);
  }

  @ApiOperation({ summary: 'Get shift schedule of a project' })
  @Get('shift/:projectId')
  async getShiftScheduleOfAProject(@Param('projectId') projectId: string) {
    return this.getShiftScheduleService.getShiftSchedule(projectId);
  }

  @ApiOperation({ summary: 'Get user notifications' })
  @Get('notifications')
  async getUserNotifications(@GetUser('userId') userId: string) {
    return this.dashboardService.getUserNotifications(userId);
  }
}
