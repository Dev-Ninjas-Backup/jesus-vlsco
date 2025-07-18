import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'e432cde3-b4cd-44f7-9bd6-3d287540a839',
    description: 'Team ID',
  })
  @IsUUID()
  @IsOptional()
  teamId?: string;

  @ApiProperty({
    example: 'e3436c4a-dc2b-44af-8b3e-9fc7b9a9e299',
    description: 'Manager user ID',
  })
  @IsUUID()
  managerId: string;

  @ApiProperty({
    example: 'New Construction Project',
    description: 'Title of the project',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Dhaka, Bangladesh',
    description: 'Project location',
  })
  @IsString()
  projectLocation: string;
}
