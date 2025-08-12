import { Module } from '@nestjs/common';
import { PoolController } from './controllers/pool.controller';
import { PoolService } from './services/pool.service';
import { GetPoolResponseService } from './services/get-pool-response.service';

@Module({
  controllers: [PoolController],
  providers: [PoolService, GetPoolResponseService],
})
export class PoolModule {}
