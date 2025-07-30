import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class PhoneLoginDto {
  @ApiProperty({ example: '+8801234567890', description: 'Phone number in international format without leading +.' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

