import { Controller } from '@nestjs/common';
import { PoolService } from '../services/pool.service';

@Controller('pool')
export class PoolController {
  constructor(private readonly poolService: PoolService) { }
}
