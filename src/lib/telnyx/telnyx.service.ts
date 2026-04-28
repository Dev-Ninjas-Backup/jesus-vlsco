import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import Telnyx from 'telnyx';

@Injectable()
export class TelnyxService {
  private readonly telnyxClient: any;
  private readonly fromPhone: string;
  private readonly alphaSender: string;
  private readonly messagingProfileId: string;
  private readonly logger = new Logger(TelnyxService.name);

  constructor(private readonly config: ConfigService) {
    this.telnyxClient = new Telnyx(
      this.config.getOrThrow(ENVEnum.TELNYX_API_KEY),
    );
    this.fromPhone = this.config.getOrThrow(ENVEnum.TELNYX_PHONE_NUMBER);
    this.alphaSender = this.config.getOrThrow(ENVEnum.TELNYX_ALPHA_SENDER);
    this.messagingProfileId = this.config.getOrThrow(
      ENVEnum.TELNYX_MESSAGING_PROFILE_ID,
    );
  }

  // +1 = US/Canada (phone number); anything else = international (alpha sender required)
  private getFrom(to: string): string {
    return to.startsWith('+1') ? this.fromPhone : this.alphaSender;
  }

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
      const message = await this.telnyxClient.messages.send({
        from: this.getFrom(to),
        to,
        text: body,
        messaging_profile_id: this.messagingProfileId,
      });

      this.logger.log(`Welcome SMS sent: ${message.data.id}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome SMS: ${error.message}`, error);
    }
  }

  async sendSms(to: string, title: string, message: string): Promise<void> {
    if (!to.startsWith('+')) {
      to = `+${to}`;
    }

    const body = `${title}\n\n${message}`;

    try {
      const sms = await this.telnyxClient.messages.send({
        from: this.getFrom(to),
        to,
        text: body,
        messaging_profile_id: this.messagingProfileId,
      });

      this.logger.log(`SMS sent: ${sms.data.id}`);
      return sms;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error);
    }
  }

  async sendVerificationSms(to: string, message: string): Promise<void> {
    if (!to.startsWith('+')) {
      to = `+${to}`;
    }

    try {
      const sms = await this.telnyxClient.messages.send({
        from: this.getFrom(to),
        to,
        text: message,
        messaging_profile_id: this.messagingProfileId,
      });

      this.logger.log(`SMS sent: ${sms.data.id}`);
      return sms;
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`, error);
    }
  }
}
