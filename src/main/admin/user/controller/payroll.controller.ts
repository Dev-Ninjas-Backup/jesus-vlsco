import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { UpdateOffdayBreakDto, UpdatePayrollRateDto } from '../dto/payroll.dto';
import { AddPayrollService } from '../services/add-payroll.service';
import { PayrollService } from '../services/payroll.service';

@ApiTags('Admin -- Add Payroll')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/payroll')
export class PayrollController {
  constructor(
    private readonly addPayrollService: AddPayrollService,
    private readonly payrollService: PayrollService,
  ) {}

  @Patch('payrate/:userId')
  async updatePayRate(
    @Param('userId') userId: string,
    @Body() dto: UpdatePayrollRateDto,
  ) {
    return this.addPayrollService.updatePayRate(userId, dto);
  }

  @Patch('offday/:userId')
  async updateOffdayBreak(
    @Param('userId') userId: string,
    @Body() dto: UpdateOffdayBreakDto,
  ) {
    return this.addPayrollService.updateOffdayBreak(userId, dto);
  }

  @Delete(':userId')
  async deletePayroll(@Param('userId') userId: string) {
    return this.payrollService.deletePayroll(userId);
  }
}
