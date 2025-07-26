import { IsString, IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateTeamChatDto {
  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsString()
  @IsNotEmpty()
  teamProfile: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsUUID()
  @IsNotEmpty()
  createBy: string; // User ID of the creator

  @IsArray()
  @IsUUID('all', { each: true })
  members: string[]; // List of user IDs to add
}
