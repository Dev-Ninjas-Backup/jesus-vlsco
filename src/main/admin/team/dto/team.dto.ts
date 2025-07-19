import { PartialType } from "@nestjs/mapped-types"
import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTeamDto {
  @ApiProperty({ example: 'Amdadul HQ' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'Amdadul HQ Description' })
  @IsString()
  @IsOptional()
  description: string
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}