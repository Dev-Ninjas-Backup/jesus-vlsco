import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ChangeShiftDto } from '../dto/change-shift.dto';
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
  ) {}

  // * Defaults
  @ApiOperation({ summary: 'Change default shift by user id' })
  @Patch('change/:userId')
  async changeShift(
    @Body() dto: ChangeShiftDto,
    @Param('userId') userId: string,
  ) {
    return await this.defaultShiftService.changeDefaultShift(userId, dto);
  }

  @ApiOperation({ summary: 'Get default shift by user id' })
  @Get('default/:userId')
  async getDefaultShift(@Param('userId') userId: string) {
    return await this.defaultShiftService.getDefaultShiftById(userId);
  }

  // * Logs
  @ApiOperation({ summary: 'Assign a shift to employee by admin' })
  @Post('assign/:userId')
  async assignShiftToEmployee(
    @Body() dto: RequestShiftDto,
    @Param('userId') userId: string,
  ) {
    return await this.shiftLogService.assignShiftToEmployee(userId, dto);
  }

  @ApiOperation({
    summary: 'Approve or reject requested shift change by admin',
  })
  @Patch('update/:shiftId')
  async updateRequestedShiftStatus(
    @Body() dto: UpdateShiftStatusDto,
    @Param('shiftId') shiftId: string,
  ) {
    return await this.shiftLogService.updateRequestedShiftStatus(shiftId, dto);
  }
}
