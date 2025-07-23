import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignUsersToASurveyDto {
  @ApiProperty({
    description: 'List of user UUIDs to assign to the survey',
    type: [String],
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class RemoveUsersFromASurveyDto {
  @ApiProperty({
    description: 'List of user UUIDs to remove from the survey',
    type: [String],
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class AssignTeamsToASurveyDto {
  @ApiProperty({
    description: 'List of team UUIDs to assign to the survey',
    type: [String],
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  teamIds: string[];
}

export class RemoveTeamsFromASurveyDto {
  @ApiProperty({
    description: 'List of team UUIDs to remove from the survey',
    type: [String],
    example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  teamIds: string[];
}
