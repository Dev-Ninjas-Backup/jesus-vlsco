import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: '8801234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 1001 })
  @Type(() => Number)
  @IsInt()
  employeeID: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}
