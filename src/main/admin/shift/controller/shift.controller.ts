import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ChangeShiftDto } from '../dto/change-shift.dto';
import {
  GetDefaultShiftsDto,
  GetShiftsLogDto,
} from '../dto/get-default-shifts.dto';
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';
import { DefaultShiftService } from '../services/default-shift.service';
import { ShiftLogService } from '../services/shift-log.service';

@ApiTags('Admin -- Shift')
@Controller('admin/shift')
@ValidateAdmin()
@ApiBearerAuth()
export class ShiftController {
  constructor(
    private readonly defaultShiftService: DefaultShiftService,
    private readonly shiftLogService: ShiftLogService,
  ) { }

  // * Defaults
  @ApiOperation({ summary: 'Set default shift of a user' })
  @Post('/:projectId/set/:userId')
  async setDefaultShiftForAUserUnderAProject(
    @Body() dto: ChangeShiftDto,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.defaultShiftService.setDefaultShiftForAUserUnderAProject(
      projectId,
      userId,
      dto,
    );
  }

  @ApiOperation({ summary: 'Change default shift of a user' })
  @Patch('/:projectId/change/:userId')
  async changeShift(
    @Body() dto: ChangeShiftDto,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.defaultShiftService.changeDefaultShift(
      projectId,
      userId,
      dto,
    );
  }

  @ApiOperation({
    summary: 'Get default shifts assigned to employee of a project',
  })
  @Get('/:projectId/default')
  async getDefaultShiftsByProjectId(
    @Param('projectId') projectId: string,
    @Query() query: GetDefaultShiftsDto,
  ) {
    return await this.defaultShiftService.getDefaultShiftsByProjectId(
      projectId,
      query,
    );
  }

  @ApiOperation({
    summary: 'Get a default shift assigned to employee of a project',
  })
  @Get('/:projectId/default/:userId')
  async getDefaultShiftsByProjectIdAndUserId(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.defaultShiftService.getDefaultShiftsByProjectIdAndUserId(
      projectId,
      userId,
    );
  }

  @ApiOperation({ summary: 'Get a default shift' })
  @Get('/default/:id')
  async getADefaultShift(@Param('id') id: string) {
    return await this.defaultShiftService.getADefaultShift(id);
  }

  @ApiOperation({ summary: 'Delete default shift of a user' })
  @Delete('/:id')
  async deleteDefaultShift(@Param('id') id: string) {
    return await this.defaultShiftService.deleteDefaultShift(id);
  }

  // * Logs
  @ApiOperation({
    summary: 'Assign a shift to employee (Not default shift change)',
  })
  @Post('shift-log/:projectId/assign/:userId')
  async assignShiftToEmployee(
    @Body() dto: RequestShiftDto,
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
  ) {
    return await this.shiftLogService.assignShiftToEmployee(
      projectId,
      userId,
      dto,
    );
  }

  @ApiOperation({ summary: 'Get all shift logs of a project of a user' })
  @Get('shift-log/:projectId/all-shift-logs/:userId')
  async getAllShiftsLogs(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @Query() query: GetShiftsLogDto,
  ) {
    return await this.shiftLogService.getAllShiftsLogs(
      projectId,
      userId,
      query,
    );
  }

  @ApiOperation({
    summary:
      'Approve or reject requested shift change (Not default shift change)',
  })
  @Patch('shift-log/:shiftLogId')
  async updateRequestedShiftStatus(
    @Query() dto: UpdateShiftStatusDto,
    @Param('shiftLogId') shiftLogId: string,
  ) {
    return await this.shiftLogService.updateRequestedShiftStatus(
      shiftLogId,
      dto,
    );
  }

  @ApiOperation({ summary: 'Get a single shift log' })
  @Get('shift-log/:shiftLogId')
  async getSingleShiftLog(@Param('shiftLogId') shiftLogId: string) {
    return await this.shiftLogService.getSingleShiftLog(shiftLogId);
  }

  @ApiOperation({ summary: 'Delete a shift log' })
  @Delete('shift-log/:shiftLogId')
  async deleteShiftLog(@Param('shiftLogId') shiftLogId: string) {
    return await this.shiftLogService.deleteShiftLog(shiftLogId);
  }
}
