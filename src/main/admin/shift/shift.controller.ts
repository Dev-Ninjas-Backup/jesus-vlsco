import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftLogService } from './services/shift.service';
import { GetShiftsService } from './services/get-shifts.service';

@ApiTags('Admin -- Shift')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('shift')
export class ShiftController {
  constructor(
    private readonly shiftLogService: ShiftLogService,
    private readonly getShiftsService: GetShiftsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateShiftDto) {
    return await this.shiftLogService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.shiftLogService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shiftLogService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return await this.shiftLogService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shiftLogService.remove(id);
  }

  @Get('assigned-users/:projectId')
  async getAssignedUsersOfAProjects(@Param('projectId') projectId: string) {
    return await this.getShiftsService.getAssignedUsersOfAProjects(projectId);
  }
}
