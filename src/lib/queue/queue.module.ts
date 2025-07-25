import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'announcement' },
      { name: 'notification' },
      { name: 'shift' },
      { name: 'email' },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
