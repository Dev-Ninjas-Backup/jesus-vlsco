import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftLogService } from './services/shift.service';
import { GetShiftsService } from './services/get-shifts.service';
import { AssignShiftService } from './services/assign-shift.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftLogService, GetShiftsService, AssignShiftService],
})
export class ShiftModule {}
