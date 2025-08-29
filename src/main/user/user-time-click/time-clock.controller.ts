import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientDateDto } from '@project/common/dto/client-date.dto';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { ClockDto, GetClockSheet, SubmitTimeSheet } from './dto/clock.dto';
import { RequestShiftDto } from './dto/request-shift.dto';
import { ClockHistoryService } from './services/clock-history.service';
import { ClockInAndOutService } from './services/clock-in-and-out.service';
import { ClockReportingService } from './services/clock-reporting.service';
import { ClockSheetService } from './services/clock-sheet.service';
import { CurrentClockShiftService } from './services/current-shift-clock.service';
import { TimeClockService } from './services/time-clock.service';
import { UserShiftService } from './services/user-shift.service';

@ApiTags('Employee -- Time Clock')
@Controller('employee/time-clock')
@ValidateAuth()
@ApiBearerAuth()
export class TimeClockController {
  constructor(
    private readonly userShiftService: UserShiftService,
    private readonly currentClockShiftService: CurrentClockShiftService,
    private readonly timeClockService: TimeClockService,
    private readonly clockInAndOutService: ClockInAndOutService,
    private readonly clockHistoryService: ClockHistoryService,
    private readonly clockReportingService: ClockReportingService,
    private readonly clockSheetService: ClockSheetService,
  ) {}

  @ApiOperation({ summary: 'Request a shift' })
  @Post('request-shift')
  async requestAShift(
    @Body() dto: RequestShiftDto,
    @GetUser('userId') userId: string,
  ) {
    return this.userShiftService.requestAShift(dto, userId);
  }

  @ApiOperation({ summary: 'Get all shifts' })
  @Get('get-all-shifts')
  async getAllShifts(
    @Query() pg: PaginationDto,
    @GetUser('userId') userId: string,
  ) {
    return this.userShiftService.getAllShifts(pg, userId);
  }

  @ApiOperation({ summary: 'Cancel a shift request' })
  @Post(':shiftId/cancel-shift-request')
  async cancelAShiftRequestIfAlreadyNotApproved(
    @Param('shiftId') shiftId: string,
  ) {
    return this.userShiftService.cancelAShiftRequestIfAlreadyNotApproved(
      shiftId,
    );
  }

  @ApiOperation({ summary: 'Get current clock with shift' })
  @Get('shift/current-clock')
  async getCurrentClock(
    @GetUser('userId') userId: string,
    @Body() dto: ClientDateDto,
  ) {
    return this.currentClockShiftService.getCurrentShiftWithClock(userId, dto);
  }

  @ApiOperation({ summary: 'Process clock' })
  @Post('process-clock')
  async processClock(@GetUser('userId') userId: string, @Body() dto: ClockDto) {
    return this.clockInAndOutService.processClock(userId, dto);
  }

  @ApiOperation({ summary: 'Get my clock sheet' })
  @Get('clock-sheet')
  async getMyClockSheet(
    @GetUser('userId') userId: string,
    @Query() dto: GetClockSheet,
  ) {
    return this.clockSheetService.getMyClockSheet(userId, dto);
  }

  @ApiOperation({ summary: 'Submit clock sheet' })
  @Post('submit-clock-sheet')
  async submitClockSheet(
    @GetUser('userId') userId: string,
    @Body() dto: SubmitTimeSheet,
  ) {
    return this.timeClockService.submitTimeClockSheet(userId, dto);
  }

  @ApiOperation({ summary: 'Get user history' })
  @Get('history')
  async getUserHistory(@GetUser('userId') userId: string) {
    return this.clockHistoryService.getUserHistory(userId);
  }

  @ApiOperation({ summary: 'Request overtime' })
  @Post('request-overtime/:clockId')
  async requestOvertimeOfAClock(
    @GetUser('userId') userId: string,
    @Param('clockId') clockId: string,
  ) {
    return this.clockReportingService.requestOvertimeOfAClock(userId, clockId);
  }

  @ApiOperation({ summary: 'Get overtime requests' })
  @Get('overtime-requests')
  async getOvertimeRequests(@GetUser('userId') userId: string) {
    return this.clockReportingService.getOvertimeRequests(userId);
  }
}
