import { PartialType } from '@nestjs/swagger';
import { CreateTimeClockDto } from './create-time-clock.dto';

export class UpdateTimeClockDto extends PartialType(CreateTimeClockDto) {}
