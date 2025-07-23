import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsString, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';

export class CreateTimeOffRequestDto {
    
  @ApiProperty({ description: 'Off Day Start' })
  @IsDateString()
  startDate: string;
  @ApiProperty({ description: 'Off Day End' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Write your reason' })
  @IsString()
  @MaxLength(200)
  reason: string;

  @ApiProperty({ description: 'You want to take full day off' })
  @IsBoolean()
  isFullDayOff: boolean;

  @ApiProperty({ description: 'Total Off day' })
  @IsInt()
  @Min(1)
  totalDaysOff: number;
}
