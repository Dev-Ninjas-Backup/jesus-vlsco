import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { RequestShiftDto } from './dto/request-shift.dto';
import { UserTimeClickService } from './user-time-click.service';

@ApiTags('Employee -- Time Clock')
@Controller('employee/time-clock')
@ValidateAuth()
@ApiBearerAuth()
export class UserTimeClickController {
  constructor(private readonly userTimeClickService: UserTimeClickService) { }

  @Post('request-shift')
  async requestAShift(@Body() dto: RequestShiftDto, @GetUser('userId') userId: string) {
    return this.userTimeClickService.requestAShift(dto, userId);
  }

  async getAllShifts() { }
  async submitTimeClock() { }
  async getAllPayrolls() { }
}
