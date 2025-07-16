import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
