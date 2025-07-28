import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ShiftEvent } from '@project/common/interface/events';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { Queue } from 'bullmq';

@Injectable()
export class ShiftService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('shift')
    private readonly shiftQueue: Queue<ShiftEvent>,
  ) {}
}
