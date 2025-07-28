import { Module } from '@nestjs/common';
import { ShiftController } from './controller/shift.controller';
import { DefaultShiftService } from './services/default-shift.service';
import { ShiftLogService } from './services/shift-log.service';
import { ShiftService } from './services/shift.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService, DefaultShiftService, ShiftLogService],
})
export class ShiftModule {}
