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
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { GetShiftsLogDto } from '@project/main/admin/shift/dto/get-default-shifts.dto';
import { RequestShiftDto } from './dto/request-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftService } from './shift.service';

@ApiTags('Employee -- Manage Shift')
@Controller('employee/shift')
@ValidateEmployee()
@ApiBearerAuth()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @ApiOperation({ summary: 'Request to change shift' })
  @Post('request')
  requestShift(
    @GetUser('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: RequestShiftDto,
  ) {
    return this.shiftService.requestShift(userId, projectId, dto);
  }

  @ApiOperation({
    summary: 'Update shift request before admin approve or reject',
  })
  @Patch('request/:id')
  updateShiftRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
    @Body() dto: UpdateShiftDto,
  ) {
    return this.shiftService.updateShiftRequest(userId, requestId, dto);
  }

  @ApiOperation({
    summary: 'Cancel shift request before admin approve or reject',
  })
  @Delete('request/:id')
  cancelShiftRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.shiftService.cancelShiftRequest(userId, requestId);
  }

  // Get all shifts log grouped by day, week or month (filter & pagination)
  @ApiOperation({ summary: 'Get all shifts log' })
  @Get('shift-logs')
  getShiftLogs(@Query() query: GetShiftsLogDto) {
    return this.shiftService.getShiftLogs(query);
  }

  // Get a shift details
  @Get('shift-logs/:id')
  getShift(@Param('shiftLogId') shiftLogId: string) {
    return this.shiftService.getShiftLog(shiftLogId);
  }
}
