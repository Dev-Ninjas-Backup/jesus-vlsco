import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreatePoolDto } from '../dto/pool.dto';
import { PoolService } from '../services/pool.service';

@ApiTags('Admin -- Pool')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) { }

  @ApiOperation({ summary: 'Create pool' })
  @Post()
  createPool(@Body() dto: CreatePoolDto) {
    return this.poolService.createPool(dto);
  }
}
