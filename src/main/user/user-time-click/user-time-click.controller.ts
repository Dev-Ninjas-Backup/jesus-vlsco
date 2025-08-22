import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { ClockDto, GetClockSheet } from './dto/clock.dto';
import { RequestShiftDto } from './dto/request-shift.dto';
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
    return this.clockInOutService.processClock(userId, dto.lat, dto.lng);
  }

  @Get('clock-sheet')
  async getMyClockSheet(
    @GetUser('userId') userId: string,
    @Query() dto: GetClockSheet,
  ) {
    return this.timeClockService.getMyClockSheet(userId, dto);
  }

  async submitTimeClock() {}
  async getAllPayrolls() {}
}
