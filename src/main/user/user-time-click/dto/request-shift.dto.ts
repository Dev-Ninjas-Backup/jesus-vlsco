import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class RequestShiftDto {
  @ApiProperty({
    description: 'Project Id',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiProperty({
    description: 'Any notes related to the shift',
    example: 'Safety inspection scheduled',
  })
  @IsString()
  note: string;

  @ApiProperty({
    description: 'Location where the shift will take place',
    example: 'Building A, Floor 2',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Latitude of the location',
    example: 23.8103,
  })
  @Type(() => Number)
  @IsNumber()
  locationLat: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 90.4125,
  })
  @Type(() => Number)
  @IsNumber()
  locationLng: number;
}
