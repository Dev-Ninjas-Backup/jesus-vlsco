import { Controller } from '@nestjs/common';
import { TimeClockService } from './time-clock.service';

@Controller('time-clock')
export class TimeClockController {
  constructor(private readonly timeClockService: TimeClockService) {}
}
