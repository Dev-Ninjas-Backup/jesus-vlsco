import { ApiProperty } from '@nestjs/swagger';
import { BreakTimePerDay, PayRateType, Weekdays } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, Min } from 'class-validator';

export class UpdatePayrollRateDto {
  @ApiProperty({ example: 100, description: 'Regular pay rate amount' })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  regularPayRate: number;

  @ApiProperty({
    enum: PayRateType,
    example: PayRateType.HOUR,
    description: 'Unit for regular pay rate',
  })
  @IsEnum(PayRateType)
  regularPayRateType: PayRateType;

  @ApiProperty({ example: 150, description: 'Overtime pay rate amount' })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  overTimePayRate: number;

  @ApiProperty({
    enum: PayRateType,
    example: PayRateType.HOUR,
    description: 'Unit for overtime pay rate',
  })
  @IsEnum(PayRateType)
  overTimePayRateType: PayRateType;

  @ApiProperty({
    example: 10,
    description: 'Number of casual leave days per year',
  })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  casualLeave: number;

  @ApiProperty({
    example: 5,
    description: 'Number of sick leave days per year',
  })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  sickLeave: number;
}

export class UpdateOffdayBreakDto {
  @ApiProperty({ example: 2, description: 'Number of off days per week' })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  numberOffDay: number;

  @ApiProperty({
    isArray: true,
    enum: Weekdays,
    example: [Weekdays.SATURDAY, Weekdays.SUNDAY],
    description: 'Selected off days',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Weekdays, { each: true })
  offDay: Weekdays[];

  @ApiProperty({
    enum: BreakTimePerDay,
    example: BreakTimePerDay.ONE_HOUR,
    description: 'Break time per day',
  })
  @IsEnum(BreakTimePerDay)
  breakTimePerDay: BreakTimePerDay;
}
