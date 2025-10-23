import { Module } from '@nestjs/common';
import { AssignShiftService } from './services/assign-shift.service';
import { GetShiftsService } from './services/get-shifts.service';
import { ShiftTemplateService } from './services/shift-template.service';
import { ShiftLogService } from './services/shift.service';
import { ShiftController } from './shift.controller';
import { ShiftReminderService } from './cron/shift-reminder.service';

@Module({
  controllers: [ShiftController],
  providers: [
    ShiftLogService,
    GetShiftsService,
    AssignShiftService,
    ShiftTemplateService,
    ShiftReminderService,
  ],
})
export class ShiftModule {}
