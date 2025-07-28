import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { ShiftService } from './shift.service';
import { RequestDefaultShiftChangeDto } from './dto/request-default-shift-change.dto';
import { UpdateShiftRequestDto } from './dto/update-shift-request.dto';
import { GetDefaultShiftsDto } from '@project/main/admin/shift/dto/get-default-shifts.dto';
import { RequestAShiftChangeDto } from './dto/request-a-shift-change.dto';

@ApiTags('Employee -- Manage Shift')
@Controller('employee/shift')
@ValidateEmployee()
@ApiBearerAuth()
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  // Request to change default shift
  @Post('default/request')
  requestDefaultShiftChange(
    @GetUser('userId') userId: string,
    @Body() dto: RequestDefaultShiftChangeDto,
  ) {
    return this.shiftService.requestDefaultShiftChange(userId, dto);
  }

  // Update default shift request before admin approve or reject
  @Patch('default/request/:id')
  updateDefaultShiftRequest(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateShiftRequestDto,
  ) {
    return this.shiftService.updateDefaultShiftRequest(userId, id, dto);
  }

  // Cancel default shift request
  @Delete('default/request/:id')
  cancelDefaultShiftRequest(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return this.shiftService.cancelDefaultShiftRequest(userId, id);
  }

  // Get a default shift
  @Get('default/:id')
  getDefaultShift(@Param('id') id: string) {
    return this.shiftService.getDefaultShift(id);
  }

  // Get default shifts (with filtering & pagination)
  @Get('default')
  getDefaultShifts(@Query() query: GetDefaultShiftsDto) {
    return this.shiftService.getDefaultShifts(query);
  }

  // Request to change a shift
  @Post('request')
  requestAShiftChange(
    @GetUser('userId') userId: string,
    @Body() dto: RequestAShiftChangeDto,
  ) {
    return this.shiftService.requestAShiftChange(userId, dto);
  }

  // Update shift request before admin approve or reject
  @Patch('request/:id')
  updateShiftRequest(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateShiftRequestDto,
  ) {
    return this.shiftService.updateShiftRequest(userId, id, dto);
  }

  // Cancel shift request
  @Delete('request/:id')
  cancelShiftRequest(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return this.shiftService.cancelShiftRequest(userId, id);
  }

  // Get a shift
  @Get(':id')
  getShift(@Param('id') id: string) {
    return this.shiftService.getShift(id);
  }

  // Get shifts log under a project (filter & pagination)
  @Get()
  getShifts(@Query() query: GetDefaultShiftsDto) {
    return this.shiftService.getShifts(query);
  }
}
