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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { GetAssignedShiftsDto } from './dto/get-assigned-shifts.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { AssignShiftService } from './services/assign-shift.service';
import { GetShiftsService } from './services/get-shifts.service';
import { ShiftLogService } from './services/shift.service';

@ApiTags('Admin -- Shift')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('shift')
export class ShiftController {
  constructor(
    private readonly shiftLogService: ShiftLogService,
    private readonly getShiftsService: GetShiftsService,
    private readonly assignShiftService: AssignShiftService,
  ) {}

  @ApiOperation({ summary: 'Assign Shift' })
  @Post()
  async create(@Body() dto: CreateShiftDto) {
    return await this.assignShiftService.create(dto);
  }

  @ApiOperation({
    summary: 'Get Shifts of a project grouped by user with project details',
  })
  @Get('assigned-users/:projectId')
  async getAssignedUsersOfAProjects(
    @Param('projectId') projectId: string,
    @Query() dto: GetAssignedShiftsDto,
  ) {
    return await this.getShiftsService.getAssignedUsersOfAProjects(
      projectId,
      dto,
    );
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
}
