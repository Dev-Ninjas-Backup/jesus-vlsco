import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateProjectDto } from '../../project/dto/create-project.dto';

export class UpdateProjectInfoDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({
    example: 'project_abc123',
    description: 'ID of the existing Project to update',
  })
  @IsString()
  @IsOptional()
  id?: string;
}

export class ManageProjectDto {
  @ApiProperty({
    type: [UpdateProjectInfoDto],
    required: false,
    description: 'List of Projects to update (only changed ones)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProjectInfoDto)
  projects?: UpdateProjectInfoDto[];
}
