import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: this.configService.get<string>(ENVEnum.MAIL_USER),
        pass: this.configService.get<string>(ENVEnum.MAIL_PASS),
      },
    });
  }

  async sendLoginCodeEmail(
    email: string,
    code: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: `"No Reply" <${this.configService.get<string>(ENVEnum.MAIL_USER)}>`,
      to: email,
      subject: 'Login Code',
      html: `
        <h3>Welcome!</h3>
        <p>Please login by using the code below:</p>
        <p>Your login code is ${code}</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: `"No Reply" <${this.configService.get<string>(ENVEnum.MAIL_USER)}>`,
      to: email,
      subject,
      html: message,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail({
    email,
    phone,
  }: {
    email: string;
    phone: string;
  }): Promise<nodemailer.SentMessageInfo> {
    const companyName = 'LGC Global Contracting Ltd';
    const loginUrl = 'https://lgcglobalcontractingltd.com';

    const mailOptions = {
      from: `"${companyName} - No Reply" <${this.configService.get<string>(
        ENVEnum.MAIL_USER,
      )}>`,
      to: email,
      subject: `🎉 Welcome to ${companyName}!`,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2c3e50;">Welcome to ${companyName}!</h2>
        <p>Your account has been successfully created with the following details:</p>
        
        <ul style="background: #f8f9fa; padding: 12px 18px; border-radius: 8px; list-style: none;">
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>

        <p>You can log in using <strong>either your phone or email</strong>. An OTP will be sent to your chosen method during login.</p>

        <p style="margin: 24px 0;">
          <a href="${loginUrl}" 
            style="background: #28a745; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block; font-weight: bold;">
            Log In to Your Account
          </a>
        </p>

        <p>Or copy and paste this link into your browser:<br/>
          <a href="${loginUrl}" style="color: #007bff;">${loginUrl}</a>
        </p>

        <p>We look forward to serving you.<br/>— The ${companyName} Team</p>
      </div>
    `,
      text: `
Welcome to ${companyName}!

Your account has been created with:
- Email: ${email}
- Phone: ${phone}

You can log in using either your phone or email. An OTP will be sent to your chosen method.

Log in here: ${loginUrl}

— The ${companyName} Team
    `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
