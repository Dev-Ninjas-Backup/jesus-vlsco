import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreatePoolDto, UpdatePoolDto } from '../dto/pool.dto';
import { PoolService } from '../services/pool.service';

@ApiTags('Admin -- Pool')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) {}

  @ApiOperation({ summary: 'Create pool' })
  @Post()
  createPool(@Body() dto: CreatePoolDto) {
    return this.poolService.createPool(dto);
  }

  @ApiOperation({ summary: 'Update pool' })
  @Patch(':poolId')
  updatePool(@Body() dto: UpdatePoolDto, @Param(':poolId') id: string) {
    return this.poolService.updatePool(id, dto);
  }

  @ApiOperation({ summary: 'Get all pools' })
  @Get('all')
  getAllPools(@Query() pg: PaginationDto) {
    return this.poolService.getPools(pg);
  }

  @ApiOperation({ summary: 'Get pool by id' })
  @Get(':id')
  getPoolById(@Body('id') id: string) {
    return this.poolService.getPool(id);
  }

  @ApiOperation({ summary: 'Delete pool by id' })
  @Delete('delete/:id')
  deletePoolById(@Body('id') id: string) {
    return this.poolService.deletePool(id);
  }
}
