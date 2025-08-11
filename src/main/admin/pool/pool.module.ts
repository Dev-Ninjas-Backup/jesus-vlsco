import { Module } from '@nestjs/common';
import { PoolController } from './controllers/pool.controller';
import { PoolService } from './services/pool.service';

@Module({
  controllers: [PoolController],
  providers: [PoolService],
})
export class PoolModule {}
