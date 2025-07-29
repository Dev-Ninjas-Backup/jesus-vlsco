import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, Matches } from "class-validator";

export class RequestShiftDto {
  @ApiProperty({
    description:
      'Filter shifts starting from this time (24h format, e.g., 08:00)',
    example: '08:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm 24-hour format',
  })
  startTime: string;

  @ApiPropertyOptional({
    description:
      'Filter shifts ending before this time (24h format, e.g., 17:00)',
    example: '17:00',
  })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm 24-hour format',
  })
  endTime: string;

  @ApiProperty({
    description: 'Start date in YYYY-MM-DD format',
    example: '2025-07-29',
  })
  @IsDateString({}, { message: 'startDate must be a valid date string' })
  startDate: string;

  @ApiProperty({
    description: 'End date in YYYY-MM-DD format',
    example: '2025-07-29',
  })
  @IsDateString({}, { message: 'endDate must be a valid date string' })
  endDate: string;

  @ApiProperty({ description: 'Manager note' })
  managerNote: string;
}
