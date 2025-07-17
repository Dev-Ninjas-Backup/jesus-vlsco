import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class EducationItemDto {
  @ApiProperty({ example: 'Bachelor of Science in Computer Science' })
  @IsString()
  @IsNotEmpty()
  program: string;

  @ApiProperty({ example: 'University of Dhaka' })
  @IsString()
  @IsNotEmpty()
  institution: string;

  @ApiProperty({ example: 2024, description: 'Graduation year' })
  @IsInt()
  year: number;
}

export class UpdateEducationItemDto extends PartialType(EducationItemDto) {}

export class EducationDto {
  @ApiProperty({
    type: [EducationItemDto],
    description: 'List of education records',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  educations: EducationItemDto[];
}

export class UpdateEducationDto {
  @ApiProperty({
    type: [UpdateEducationItemDto],
    description: 'List of education records',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationItemDto)
  educations: UpdateEducationItemDto[];
}
