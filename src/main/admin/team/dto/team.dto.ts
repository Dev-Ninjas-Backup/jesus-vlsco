import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering Team' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Handles all product engineering and devops tasks.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  department: string;

  // @ApiProperty({
  //   type: 'string',
  //   format: 'binary',
  //   description: 'Optional team image or logo',
  //   required: false,
  // })
  // @IsOptional()
  // image?: any; // Will be handled with @UploadedFile() in controller

  // @ApiProperty({
  //   example: 'aee23bfb-1fbd-4f39-bde7-1f5e3857d650',
  //   description: 'ID of the user creating the team',
  // })
  // @IsUUID()
  // @IsNotEmpty()
  // creatorId: string;

  @ApiProperty({
    example: [
      'fa24c6d2-09c6-498f-9f84-878cf3871225',
      'a1e5c6c9-bc77-4ef0-8aa2-5ff1ea82d27d',
    ],
    description: 'Optional array of user IDs to add as team members',
    required: false,
  })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Try CSV fallback
        return value.split(',').map((v) => v.trim());
      }
    }

    return [];
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  members?: string[];
}

export class UpdateTeamDto extends PartialType(CreateTeamDto) {}

export class AddMembersToTeamDto {
  @ApiProperty({
    example: [
      'e432cde3-b4cd-44f7-9bd6-3d287540a839',
      'd132bfc7-1d4e-4472-9d65-72ed7f6bb54c',
    ],
    description: 'Array of employee IDs to assign',
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  members: string[];
}
