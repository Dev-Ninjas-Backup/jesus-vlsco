import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import {
  CreateMissedClockRequestDto,
  UpdateClockRequestDto,
} from '../dto/request-clock.dto';
import { MissedClockRequestService } from '../services/missed-clock-request.service';

@ApiTags('Employee -- Request Time Clock')
@Controller('employee/request-time-clock')
@ValidateAuth()
@ApiBearerAuth()
export class RequestMissedClockController {
  constructor(
    private readonly missedClockRequestService: MissedClockRequestService,
  ) {}

  @ApiOperation({ summary: 'Get all missed clock requests' })
  @Get()
  async getMissedClockRequests(
    @GetUser('userId') userId: string,
    @Query() pd: PaginationDto,
  ) {
    return this.missedClockRequestService.getMissedClockRequests(userId, pd);
  }

  @ApiOperation({ summary: 'Get single missed clock request' })
  @Get(':requestId')
  async getSingleMissedClockRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.missedClockRequestService.getSingleMissedClockRequest(
      userId,
      requestId,
    );
  }

  @ApiOperation({ summary: 'Request missed clock' })
  @Post('request')
  async requestClock(
    @GetUser('userId') userId: string,
    @Body() dto: CreateMissedClockRequestDto,
  ) {
    return this.missedClockRequestService.requestClock(userId, dto);
  }

  @ApiOperation({ summary: 'Cancel missed clock request' })
  @Patch('cancel/:requestId')
  async cancelRequest(
    @GetUser('userId') userId: string,
    @Param('requestId') requestId: string,
  ) {
    return this.missedClockRequestService.cancelRequest(userId, requestId);
  }

  @ApiOperation({ summary: 'Update missed clock request' })
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
