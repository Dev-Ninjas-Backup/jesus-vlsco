import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OffDayRequestService } from './services/off-day-request.service';
import {
  CreateTimeOffRequestDto,
  UpdateTimeOffRequestDto,
} from './dto/off-day-request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';

@ApiTags('User -- Off Day Request')
@Controller('user/time-off-request')
@ValidateAuth()
@ApiBearerAuth()
export class TimeoffRequestController {
  constructor(private readonly offDayRequestService: OffDayRequestService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new off day request' })
  async createOffDayRequest(
    @Body() createTimeOffRequestDto: CreateTimeOffRequestDto,
    @GetUser('userId') userId: string,
  ) {
    return this.offDayRequestService.createOffDayRequset(
      createTimeOffRequestDto,
      userId,
    );
  }

  @Get('my-requests')
  @ApiOperation({
    summary: 'Get all off day requests for the authenticated user',
  })
  async getOffDayRequests(@GetUser('userId') userId: string) {
    return this.offDayRequestService.getOffDayRequests(userId);
  }

  @Patch('my-requests/:id')
  @ApiOperation({ summary: 'Update an existing off day request' })
  async updateOffDayRequest(
    @Body() updateTimeOffRequestDto: UpdateTimeOffRequestDto,
    @GetUser('userId') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.offDayRequestService.updateOffDayRequest(
      requestId,
      updateTimeOffRequestDto,
      userId,
    );
  }

  @Delete('my-requests/:id')
  @ApiOperation({ summary: 'Delete an off day request' })
  async deleteOffDayRequest(
    @GetUser('userId') userId: string,
    @Param('id') requestId: string,
  ) {
    return this.offDayRequestService.deleteOffDayRequest(userId, requestId);
  }
}
