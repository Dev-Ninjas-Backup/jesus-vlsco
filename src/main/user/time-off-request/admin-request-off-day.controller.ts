import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { AdminRequestOffDayService } from './services/admin-request-off-day.service';
import { AdminRequestOffDayStatusDto } from './dto/admin-off-day-request.dto';

@ApiTags('Admin -- Off Day Request')
@Controller('admin/time-off-request')
@ValidateAdmin()
@ApiBearerAuth()
export class AdminRequestOffDayController {
    constructor(private readonly adminRequestOffDayService: AdminRequestOffDayService) {}

    @Get('all-requests')
    @ApiOperation({ summary: 'Get all off day requests' })
    async getAllOffDayRequests() {
        return this.adminRequestOffDayService.getAllOffDayRequests();
    }

    // Off Day Request Update by Admin
    @ApiOperation({ summary: 'Update an off day request by Admin' })
    @Patch('update-request/:id')
    @ApiOperation({ summary: 'Update an off day request' })
    async updateOffDayRequest(
        @Param('id') requestId: string,
        @Body() updateTimeOffRequestDto: AdminRequestOffDayStatusDto,
    ) {
        return this.adminRequestOffDayService.updateOffDayRequest(requestId, updateTimeOffRequestDto);
    }
}
