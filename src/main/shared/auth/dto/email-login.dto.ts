import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailLoginDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class SuperAdminLoginDto {
  @ApiProperty({ example: 'jesus.vlsco@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
