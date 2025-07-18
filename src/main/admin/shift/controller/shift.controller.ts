import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';
import { ShiftService } from '../services/shift.service';
import { ChangeShiftDto } from '../dto/change-shift.dto';

@ApiTags('Admin -- Shift')
@Controller('admin/shift')
@ValidateAdmin()
@ApiBearerAuth()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('assign/:userId')
  async assignShiftToEmployee(
    @Body() dto: RequestShiftDto,
    @Param('userId') userId: string,
  ) {
    return await this.shiftService.assignShiftToEmployee(userId, dto);
  }

  @Patch('update/:shiftId')
  async updateShiftStatus(
    @Body() dto: UpdateShiftStatusDto,
    @Param('shiftId') shiftId: string,
  ) {
    return await this.shiftService.updateShiftStatus(shiftId, dto);
  }

  @Patch('change/:shiftId')
  async changeShift(
    @Body() dto: ChangeShiftDto,
    @Param('shiftId') shiftId: string,
  ) {
    return await this.shiftService.changeShift(shiftId, dto);
  }
}
