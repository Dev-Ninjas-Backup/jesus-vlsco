import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PoolResponseDto {
  @ApiProperty({ example: '6f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f' })
  @IsUUID()
  optionId: string;
}
