import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyBranchNestedDto {
  @ApiProperty({ example: 'TechCorp - New York', description: 'Branch name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'New York, NY', description: 'Branch location' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 'user_xyz456',
    description: 'User ID of the branch manager (optional)',
    required: false,
  })
  @IsString()
  managerId: string;
}
