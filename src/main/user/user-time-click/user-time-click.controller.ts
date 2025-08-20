import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { RequestShiftDto } from './dto/request-shift.dto';
import { UserTimeClickService } from './user-time-click.service';

@ApiTags('Employee -- Time Clock')
@Controller('employee/time-clock')
@ValidateAuth()
@ApiBearerAuth()
export class UserTimeClickController {
  constructor(private readonly userTimeClickService: UserTimeClickService) {}

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

  async submitTimeClock() {}
  async getAllPayrolls() {}
}
