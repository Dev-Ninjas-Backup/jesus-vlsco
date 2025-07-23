import { Body, Controller, Post } from '@nestjs/common';
import { OffDayRequestService } from './services/off-day-request.service';
import { CreateTimeOffRequestDto } from './dto/off-day-request.dto';
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
    async createOffDayRequest(@Body() createTimeOffRequestDto: CreateTimeOffRequestDto,@GetUser('userId') userId: string) {
        return this.offDayRequestService.createOffDayRequset(createTimeOffRequestDto, userId);
    }
        
    
}
