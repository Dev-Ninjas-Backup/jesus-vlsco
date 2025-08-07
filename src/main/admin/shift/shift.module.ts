import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftLogService } from './shift.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftLogService],
})
export class ShiftModule {}
