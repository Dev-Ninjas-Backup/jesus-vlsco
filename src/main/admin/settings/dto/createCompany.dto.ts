import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateCompanyBranchNestedDto } from './createCompanyBranch.dto';

export class CreateCompanyWithBranchDto {
  @ApiProperty({ example: 'TechCorp Inc.', description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'San Francisco, CA',
    description: 'Company headquarters location',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  //   @ApiProperty({
  //     example: 'https://example.com/logo.png',
  //     description: 'Optional logo URL',
  //     required: false,
  //   })
  //   @IsOptional()
  //   @IsString()
  //   logo?: string;

  @ApiProperty({
    type: [CreateCompanyBranchNestedDto],
    description: 'One or more branches to be created with the company',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompanyBranchNestedDto)
  branches: CreateCompanyBranchNestedDto[];
}
