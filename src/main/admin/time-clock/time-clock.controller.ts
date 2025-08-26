import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { ApproveOrRejectShiftRequest } from './dto/time-clock.dto';
import { TimeClockService } from './time-clock.service';

@ApiTags('Admin -- Time Clock')
@Controller('admin/time-clock')
@ValidateAdmin()
@ApiBearerAuth()
export class TimeClockController {
  constructor(private readonly timeClockService: TimeClockService) {}

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
}
