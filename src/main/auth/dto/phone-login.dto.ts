import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneLoginDto {
  @ApiProperty({ example: 'firebaseIdToken' })
  @IsString()
  @IsNotEmpty()
  firebaseIdToken: string;
}
