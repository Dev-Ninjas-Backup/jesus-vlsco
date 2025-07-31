import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class VerifyOTPDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  otp: number;
}

export class VerifyPhoneOTPDto {
  @ApiProperty({
    example: '8801234567890',
    description: 'Phone number in international format without leading +.',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10,15}$/, { message: 'Invalid phone number format' })
  phoneNumber: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  otp: number;
}
