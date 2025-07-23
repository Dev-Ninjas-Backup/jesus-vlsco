import { ApiProperty } from "@nestjs/swagger";
import { TimeOffRequestStatus } from "@prisma/client";
import { IsEnum, IsString, IsUUID } from "class-validator";

export class AdminRequestOffDayStatusDto {

  @ApiProperty({ description: 'Status of the request' })
//   @IsString()
  @IsEnum([TimeOffRequestStatus.PENDING, TimeOffRequestStatus.APPROVED, TimeOffRequestStatus.REJECTED])
  status: TimeOffRequestStatus;

}