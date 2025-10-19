import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import telnyx from 'telnyx';

@Injectable()
export class TelnyxService {
  private readonly telnyxClient: any;
  private readonly fromPhone: string;
  private readonly logger = new Logger(TelnyxService.name);

  constructor(private readonly config: ConfigService) {
    this.telnyxClient = new telnyx(
      this.config.getOrThrow(ENVEnum.TELNYX_API_KEY),
    );
    this.fromPhone = this.config.getOrThrow(ENVEnum.TELNYX_PHONE_NUMBER);
  }

  // ========== SEND WELCOME SMS ==========
  async sendWelcomeSms(to: string, email: string): Promise<void> {
    if (!to.startsWith('+')) {
      to = `+${to}`;
    }

    const loginUrl = 'https://lgcglobalcontractingltd.com';

    const body = `🎉 Welcome to LGC Global Contracting Ltd!
Your account has been created.
Login with either your email (${email}) or phone (${to}). 
An OTP will be sent during login.
👉 Login here: ${loginUrl}`;

    try {
      const message = await this.telnyxClient.messages.create({
        from: this.fromPhone,
        to,
        text: body,
      });

      this.logger.log(`Welcome SMS sent: ${message.data.id}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome SMS: ${error.message}`, error);
    }
  }

  // ========== GENERAL SMS SENDER ==========
  async sendSms(to: string, title: string, message: string): Promise<void> {
    if (!to.startsWith('+')) {
      to = `+${to}`;
    }

    const body = `${title}\n\n${message}`;

    try {
      const sms = await this.telnyxClient.messages.create({
        from: this.fromPhone,
        to,
        text: body,
      });

      this.logger.log(`SMS sent: ${sms.data.id}`);
      return sms;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
    }
  }
}
