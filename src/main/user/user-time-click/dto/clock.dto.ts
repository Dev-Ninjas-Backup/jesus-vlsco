import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ClockDto {
  @ApiProperty({
    description: 'Latitude of the user location',
    example: 23.8103,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude must be a number' })
  lat: number;

  @ApiProperty({
    description: 'Longitude of the user location',
    example: 90.4125,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude must be a number' })
  lng: number;
}
