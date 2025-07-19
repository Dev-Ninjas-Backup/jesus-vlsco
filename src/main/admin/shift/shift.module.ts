import { Module } from '@nestjs/common';
import { ShiftController } from './controller/shift.controller';
import { ShiftService } from './services/shift.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
