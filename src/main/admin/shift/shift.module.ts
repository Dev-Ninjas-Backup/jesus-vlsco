import { Module } from '@nestjs/common';
import { AssignShiftService } from './services/assign-shift.service';
import { GetShiftsService } from './services/get-shifts.service';
import { ShiftTemplateService } from './services/shift-template.service';
import { ShiftLogService } from './services/shift.service';
import { ShiftController } from './shift.controller';

@Module({
  controllers: [ShiftController],
  providers: [
    ShiftLogService,
    GetShiftsService,
    AssignShiftService,
    ShiftTemplateService,
  ],
})
export class ShiftModule {}
