import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { GetAssignedShiftsDto } from '@project/main/admin/shift/dto/get-assigned-shifts.dto';
import { GetShiftsService } from '@project/main/admin/shift/services/get-shifts.service';
import { DashboardService } from './services/dashboard.service';

@ApiTags('Employee -- Dashboard & Shifts')
@Controller('employee/dashboard')
@ValidateAuth()
@ApiBearerAuth()
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly getShiftsService: GetShiftsService,
  ) {}

  @ApiOperation({ summary: 'Get user dashboard' })
  @Get()
  async getUserDashboard(@GetUser('userId') userId: string) {
    return this.dashboardService.getUserDashboard(userId);
  }

  @ApiOperation({ summary: 'Get shift schedule of a project' })
  @Get('assigned-users/:projectId')
  async getAssignedUsersOfAProjects(
    @Param('projectId') projectId: string,
    @Query() dto: GetAssignedShiftsDto,
  ) {
    return await this.getShiftsService.getAssignedUsersOfAProjects(
      projectId,
      dto,
    );
  }

  @ApiOperation({ summary: 'Get user notifications' })
  @Get('notifications')
  async getUserNotifications(@GetUser('userId') userId: string) {
    return this.dashboardService.getUserNotifications(userId);
  }
}
