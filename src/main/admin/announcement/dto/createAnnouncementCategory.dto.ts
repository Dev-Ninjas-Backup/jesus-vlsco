import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAnnouncementCategoryDto {
  @ApiProperty({ example: 'Company Updates', description: 'Name of the announcement category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Updates related to company policies and announcements', description: 'Description of the announcement category', required: false })
  @IsString()
  description?: string;
}