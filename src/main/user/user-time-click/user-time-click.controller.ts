import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { ClockDto, GetClockSheet, SubmitTimeSheet } from './dto/clock.dto';
import { RequestShiftDto } from './dto/request-shift.dto';
import { ClockHistoryService } from './services/clock-history.service';
import { ClockInAndOutService } from './services/clock-in-and-out.service';
import { ClockInOutService } from './services/clock-in-out.service';
import { TimeClockService } from './services/time-clock.service';
import { UserTimeClickService } from './services/user-time-click.service';

@ApiTags('Employee -- Time Clock')
@Controller('employee/time-clock')
@ValidateAuth()
@ApiBearerAuth()
export class UserTimeClickController {
  constructor(
    private readonly userTimeClickService: UserTimeClickService,
    private readonly clockInOutService: ClockInOutService,
    private readonly timeClockService: TimeClockService,
    private readonly clockInAndOutService: ClockInAndOutService,
    private readonly clockHistoryService: ClockHistoryService,
  ) {}

  @Post('request-shift')
  async requestAShift(
    @Body() dto: RequestShiftDto,
    @GetUser('userId') userId: string,
  ) {
    return this.userTimeClickService.requestAShift(dto, userId);
  }

  @Get('get-all-shifts')
  async getAllShifts(
    @Query() pg: PaginationDto,
    @GetUser('userId') userId: string,
  ) {
    return this.userTimeClickService.getAllShifts(pg, userId);
  }

  @Get('shift/current-clock')
  async getCurrentClock(@GetUser('userId') userId: string) {
    return this.clockInOutService.getCurrentShiftWithClock(userId);
  }

  @Post(':shiftId/cancel-shift-request')
  async cancelAShiftRequestIfAlreadyNotApproved(
    @Param('shiftId') shiftId: string,
  ) {
    return this.userTimeClickService.cancelAShiftRequestIfAlreadyNotApproved(
      shiftId,
    );
  }

  @Post('process-clock')
  async processClock(@GetUser('userId') userId: string, @Body() dto: ClockDto) {
    return this.clockInAndOutService.processClock(userId, dto);
  }

  @Get('clock-sheet')
  async getMyClockSheet(
    @GetUser('userId') userId: string,
    @Query() dto: GetClockSheet,
  ) {
    return this.timeClockService.getMyClockSheet(userId, dto);
  }

  @Post('submit-clock-sheet')
  async submitClockSheet(
    @GetUser('userId') userId: string,
    @Body() dto: SubmitTimeSheet,
  ) {
    return this.timeClockService.submitTimeClockSheet(userId, dto);
  }

  @Get('history')
  async getUserHistory(@GetUser('userId') userId: string) {
    return this.clockHistoryService.getUserHistory(userId);
  }
}
