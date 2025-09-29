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
import {
  ApproveOrRejectShiftRequest,
  GetTimeSheetDto,
  GetUserReportDto,
} from '../dto/time-clock.dto';
import { GetUserReportService } from '../services/get-user-report.service';
import { OvertimeService } from '../services/overtime.service';
import { PayrollService } from '../services/payroll.service';
import { ShiftRequestService } from '../services/shift-request.service';
import { TimeSheetService } from '../services/time-sheet.service';

@ApiTags('Admin -- Time Clock')
@Controller('admin/time-clock')
@ValidateAdmin()
@ApiBearerAuth()
export class TimeClockController {
  constructor(
    private readonly shiftRequestService: ShiftRequestService,
    private readonly payrollService: PayrollService,
    private readonly timeSheetService: TimeSheetService,
    private readonly overtimeService: OvertimeService,
    private readonly userReportService: GetUserReportService,
  ) {}

  @ApiOperation({ summary: 'Get all pending shifts by all users' })
  @Get()
  async getAllPendingShiftsByAllUsers(@Query() pg: PaginationDto) {
    return await this.shiftRequestService.getAllPendingShiftsByAllUsers(pg);
  }

  @ApiOperation({ summary: 'Approve or reject shift request' })
  @Patch(':shiftId/approve-or-reject')
  async approveOrRejectShiftRequest(
    @Body() dto: ApproveOrRejectShiftRequest,
    @Param('shiftId') shiftId: string,
  ) {
    return await this.shiftRequestService.approveOrRejectShiftRequest(
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

  @ApiOperation({ summary: 'Get all users time sheet by date' })
  @Get('time-sheet')
  async getAllUsersTimeSheetByDate(@Query() dto: GetTimeSheetDto) {
    return await this.timeSheetService.getAllUsersTimeSheetByDate(dto);
  }

  @ApiOperation({ summary: 'Get all users time sheet by time range' })
  @Get('time-sheet/time-range')
  async getAllUsersTimeSheetByTimeRange(@Query() dto: GetUserReportDto) {
    return await this.userReportService.getUsersReport(dto);
  }

  @ApiOperation({ summary: 'Get all pending overtime' })
  @Get('overtime')
  async getAllPendingOvertime(@Query() pg: PaginationDto) {
    return await this.overtimeService.getAllPendingOvertime(pg);
  }

  @ApiOperation({ summary: 'Get single overtime' })
  @Get('overtime/:id')
  async getSingleOvertime(@Param('id') id: string) {
    return await this.overtimeService.getSingleOvertime(id);
  }

  @ApiOperation({ summary: 'Accept or reject overtime' })
  @Patch('overtime/:id/accept-or-reject')
  async acceptOrRejectOvertime(
    @Param('id') id: string,
    @Body() dto: ApproveOrRejectShiftRequest,
  ) {
    return await this.overtimeService.acceptOrRejectOvertime(id, dto);
  }

  @ApiOperation({ summary: 'Delete a clock' })
  @Delete('overtime/:id')
  async deleteAClock(@Param('id') id: string) {
    return await this.timeSheetService.deleteAClock(id);
  }
}
