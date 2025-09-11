import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { UpdateClockRequestDto } from '@project/main/user/time-clock/dto/request-clock.dto';
import { MissedClockRequestService } from '@project/main/user/time-clock/services/missed-clock-request.service';
import { ApproveOrRejectShiftRequest } from '../dto/time-clock.dto';
import { ManageClockRequestService } from '../services/manage-clock-request.service';

@ApiTags('Admin -- Time Clock')
@Controller('admin/time-clock/clock-request')
@ValidateAdmin()
@ApiBearerAuth()
export class ManageClockRequestController {
  constructor(
    private readonly manageClockRequestService: ManageClockRequestService,
    private readonly missedClockRequestService: MissedClockRequestService,
  ) {}

  @ApiOperation({ summary: 'Get clock request' })
  @Get()
  async getClockRequest(@Query() pg: PaginationDto) {
    return await this.manageClockRequestService.getClockRequest(pg);
  }

  @ApiOperation({ summary: 'Get single clock request' })
  @Get(':requestId')
  async getSingleClockRequest(@Param('requestId') requestId: string) {
    return await this.manageClockRequestService.getSingleClockRequest(
      requestId,
    );
  }

  @ApiOperation({ summary: 'Accept or reject clock request' })
  @Patch(':requestId')
  async acceptOrRejectClockRequest(
    @Param('requestId') requestId: string,
    @Body() dto: ApproveOrRejectShiftRequest,
    @GetUser('userId') adminId: string,
  ) {
    return await this.manageClockRequestService.acceptOrRejectClockRequest(
      requestId,
      dto,
      adminId,
    );
  }

  @ApiOperation({ summary: 'Update a pending clock request' })
  @Patch('update/:requestId')
  async updateAPendingRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
    @Body() dto: UpdateClockRequestDto,
  ) {
    return this.missedClockRequestService.updateAPendingRequest(
      userId,
      requestId,
      dto,
    );
  }
}
