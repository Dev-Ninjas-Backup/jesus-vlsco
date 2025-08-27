import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ApproveOrRejectShiftRequest } from './dto/time-clock.dto';
import { PayrollService } from './services/payroll.service';
import { TimeClockService } from './services/time-clock.service';

@ApiTags('Admin -- Time Clock')
@Controller('admin/time-clock')
@ValidateAdmin()
@ApiBearerAuth()
export class TimeClockController {
  constructor(
    private readonly timeClockService: TimeClockService,
    private readonly payrollService: PayrollService,
  ) {}

  @ApiOperation({ summary: 'Get all pending shifts by all users' })
  @Get()
  async getAllPendingShiftsByAllUsers(@Query() pg: PaginationDto) {
    return await this.timeClockService.getAllPendingShiftsByAllUsers(pg);
  }

  @ApiOperation({ summary: 'Approve or reject shift request' })
  @Patch(':shiftId/approve-or-reject')
  async approveOrRejectShiftRequest(
    @Body() dto: ApproveOrRejectShiftRequest,
    @Param('shiftId') shiftId: string,
  ) {
    return await this.timeClockService.approveOrRejectShiftRequest(
      dto,
      shiftId,
    );
  }

  @ApiOperation({ summary: 'Get all payroll entries' })
  @Get('payroll-entries')
  async getPayRollEntries(@Query() pg: PaginationDto) {
    return await this.payrollService.getPayRollEntries(pg);
  }

  @ApiOperation({ summary: 'Get payroll entry by id' })
  @Get('payroll-entries/:id')
  async getPayRollEntryById(@Param('id') id: string) {
    return await this.payrollService.getPayRollEntryById(id);
  }

  @ApiOperation({ summary: 'Delete payroll entry by id' })
  @Delete('payroll-entries/:id')
  async deletePayrollEntryById(@Param('id') id: string) {
    return await this.payrollService.deletePayrollEntryById(id);
  }

  @ApiOperation({ summary: 'Accept or reject payroll entry by id' })
  @Patch('payroll-entries/:id/accept-or-reject')
  async acceptOrRejectPayrollEntryById(
    @Param('id') id: string,
    @Body() dto: ApproveOrRejectShiftRequest,
  ) {
    return await this.payrollService.acceptOrRejectPayrollEntryById(
      id,
      dto.isApproved,
    );
  }
}
