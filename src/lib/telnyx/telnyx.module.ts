import { Global, Module } from '@nestjs/common';
import { TelnyxService } from './telnyx.service';

@Global()
@Module({
  providers: [TelnyxService],
  exports: [TelnyxService],
})
export class TelnyxModule {}
