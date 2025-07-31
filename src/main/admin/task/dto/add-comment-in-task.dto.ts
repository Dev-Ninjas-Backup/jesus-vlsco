import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTaskCommentDto {
  @ApiProperty({ example: 'Do the task as early as possiable' })
  @IsString()
  comment: string;
}
