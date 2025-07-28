import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ChangeShiftDto } from '../dto/change-shift.dto';
import { GetDefaultShiftsDto } from '../dto/get-default-shifts.dto';
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';
import { DefaultShiftService } from '../services/default-shift.service';
import { ShiftLogService } from '../services/shift-log.service';
import { ShiftService } from '../services/shift.service';

@ApiTags('Admin -- Shift')
@Controller('admin/shift')
@ValidateAdmin()
@ApiBearerAuth()
export class ShiftController {
  constructor(
    private readonly shiftService: ShiftService,
    private readonly defaultShiftService: DefaultShiftService,
    private readonly shiftLogService: ShiftLogService,
  ) { }

  // * Defaults
  @ApiOperation({ summary: 'Get default shifts assigned to employee of a project' })
  @Get('default/:projectId')
  async getDefaultShiftsByProjectId(
    @Param('projectId') projectId: string,
    @Query() query: GetDefaultShiftsDto,
  ) {
    return await this.defaultShiftService.getDefaultShiftsByProjectId(projectId, query);
  }

  @ApiOperation({ summary: 'Change default shift of a user' })
  @Patch('/:projectId/change/:userId')
  async changeShift(
    @Body() dto: ChangeShiftDto,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.defaultShiftService.changeDefaultShift(projectId, userId, dto);
  }

  // * Logs
  @ApiOperation({ summary: 'Assign a shift to employee (Not default shift change)' })
  @Post('/:projectId/assign/:userId')
  async assignShiftToEmployee(
    @Body() dto: RequestShiftDto,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.shiftLogService.assignShiftToEmployee(projectId, userId, dto);
  }

  @ApiOperation({
    summary: 'Approve or reject requested shift change (Not default shift change)',
  })
  @Patch('update/:shiftLogId')
  async updateRequestedShiftStatus(
    @Query() dto: UpdateShiftStatusDto,
    @Param('shiftLogId') shiftLogId: string,
  ) {
    return await this.shiftLogService.updateRequestedShiftStatus(shiftLogId, dto);
  }
}
