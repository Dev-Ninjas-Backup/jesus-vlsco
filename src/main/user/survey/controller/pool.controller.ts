import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { GetAssignedSurveyDto } from '../dto/get-assigned-survey.dto';
import { PoolResponseDto } from '../dto/pool-response.dto';
import { PoolService } from '../services/pool.service';

@ApiTags('Employee -- Survey & Pool')
@Controller('employee/pool')
@ValidateEmployee()
@ApiBearerAuth()
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @Get('assigned')
  async getAllAssignedPools(
    @GetUser('userId') userId: string,
    @Query() query: GetAssignedSurveyDto,
  ) {
    return await this.poolService.getAllAssignedPools(userId, query);
  }

  @Get(':id/assigned')
  async getSinglePool(@Param('id') id: string) {
    return await this.poolService.getSinglePool(id);
  }

  @Post(':id/response')
  async responseToAPool(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: PoolResponseDto,
  ) {
    return await this.poolService.responseToAPool(userId, id, dto);
  }
}
