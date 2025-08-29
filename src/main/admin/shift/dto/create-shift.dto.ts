import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateShiftDto {
  @ApiProperty({
    description: 'The ID of the current project',
    example: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4',
  })
  @IsString()
  currentProjectId: string;

  @ApiProperty({
    description: 'The date of the shift (YYYY-MM-DD)',
    example: '2025-08-07',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ enum: ShiftStatus })
  @IsEnum(ShiftStatus)
  shiftStatus: ShiftStatus;

  @ApiProperty({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @IsISO8601()
  startTime: string;

  @ApiProperty({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @IsISO8601()
  endTime: string;

  @ApiProperty({
    description: 'Title of the shift',
    example: 'Morning Shift',
  })
  @IsString()
  shiftTitle: string;

  @ApiProperty({
    description: 'Indicates if the shift spans the entire day',
    example: false,
  })
  @IsBoolean()
  allDay: boolean;

  @ApiProperty({
    description: 'Job or role assigned during the shift',
    example: 'Site Supervisor',
  })
  @IsString()
  job: string;

  @ApiProperty({
    description: 'List of User IDs assigned to this shift',
    example: ['a1b2c3d4-e5f6-7890-1234-56789abcdef0'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

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

  @ApiProperty({
    description: 'Any notes related to the shift',
    example: 'Safety inspection scheduled',
  })
  @IsString()
  note: string;
}
