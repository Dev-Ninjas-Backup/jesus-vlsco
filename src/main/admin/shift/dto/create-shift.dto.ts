import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShiftStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateShiftDto {
  // @ApiProperty({
  //   description: 'Current user Id',
  //   example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  // })
  // @IsString()
  // currentUserId: string;

  @ApiProperty({
    description: 'Project Id',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsString()
  currentProjectId: string;

  @ApiProperty({
    description: 'The date of the shift (YYYY-MM-DD)',
    example: '2025-08-07',
  })
  @IsDateString()
  date: Date;

  @ApiProperty({ enum: ShiftStatus })
  @IsEnum(ShiftStatus)
  shiftStatus: ShiftStatus;

  @ApiProperty({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @IsDateString()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @IsDateString()
  endTime: Date;

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

  @ApiPropertyOptional({
    description: 'List of User IDs assigned to this shift',
    example: ['a1b2c3d4-e5f6-7890-1234-56789abcdef0'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  // @IsUUID('all', { each: true })
  userIds?: string[];

  @ApiPropertyOptional({
    description: 'List of Task IDs assigned to this shift',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  // @IsUUID('all', { each: true })
  taskIds?: string[];

  @ApiProperty({
    description: 'Location where the shift will take place',
    example: 'Building A, Floor 2',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Any notes related to the shift',
    example: 'Safety inspection scheduled',
  })
  @IsString()
  note: string;

  @ApiProperty({
    description: 'Save as template',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  saveAsTemplate?: boolean; // 👈 new field
}
