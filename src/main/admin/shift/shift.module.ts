import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftLogService } from './services/shift.service';
import { GetShiftsService } from './services/get-shifts.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftLogService, GetShiftsService],
})
export class ShiftModule {}
