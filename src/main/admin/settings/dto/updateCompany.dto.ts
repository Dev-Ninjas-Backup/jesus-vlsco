import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateCompanyBranchNestedDto } from './createCompanyBranch.dto';

export class UpdateBranchDto extends PartialType(CreateCompanyBranchNestedDto) {
  @ApiPropertyOptional({
    example: 'branch_abc123',
    description: 'ID of the existing branch to update',
  })
  @IsString()
  @IsOptional()
  id?: string;
}

export class UpdateCompanyWithBranchesDto {
  @ApiProperty({ example: 'New TechCorp Inc.', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Austin, TX', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    type: [UpdateBranchDto],
    required: false,
    description: 'List of branches to update (only changed ones)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBranchDto)
  branches?: UpdateBranchDto[];
}
