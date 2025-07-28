// send-team-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendTeamMessageDto {
  @ApiProperty({ example: 'Hey team!', type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional file attachment',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
