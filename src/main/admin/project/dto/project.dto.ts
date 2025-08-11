import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignEmployeesToProjectDto {
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
  employees: string[];
}

export class UpdateProjectTitle {
  @ApiProperty({
    example: 'Project Title',
    description: 'Title of the project',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
