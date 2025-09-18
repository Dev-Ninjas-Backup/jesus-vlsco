import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { GetAssignedShiftsDto } from './dto/get-assigned-shifts.dto';
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

  @ApiOperation({ summary: 'Get all shifts' })
  @Get()
  async findAll() {
    return await this.shiftLogService.findAll();
  }

  @ApiOperation({ summary: 'Get shift by id' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.shiftLogService.findOne(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
  //   return await this.shiftLogService.update(id, dto);
  // }

  @ApiOperation({ summary: 'Delete shift by id' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.shiftLogService.remove(id);
  }
}
