import { ShiftType } from "@prisma/client";
import { PaginationDto } from "@project/common/dto/pagination.dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, Matches } from "class-validator";

export class GetDefaultShiftsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Filter shifts starting from this time (24h format, e.g., 08:00)",
    example: "08:00",
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "startTime must be in HH:mm 24-hour format",
  })
  startTime?: string;

  @ApiPropertyOptional({
    description: "Filter shifts ending before this time (24h format, e.g., 17:00)",
    example: "17:00",
  })
  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "endTime must be in HH:mm 24-hour format",
  })
  endTime?: string;

  @ApiPropertyOptional({
    enum: ShiftType,
    description: "Filter by type of shift",
    example: ShiftType.MORNING,
  })
  @IsEnum(ShiftType)
  @IsOptional()
  shiftType?: ShiftType;
}
