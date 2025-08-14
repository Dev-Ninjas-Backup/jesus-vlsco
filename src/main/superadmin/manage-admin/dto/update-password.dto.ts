import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'newPassword',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiPropertyOptional({
    description: 'Current password',
    example: 'currentPassword',
  })
  @IsOptional()
  @IsString()
  currentPassword?: string;
}
