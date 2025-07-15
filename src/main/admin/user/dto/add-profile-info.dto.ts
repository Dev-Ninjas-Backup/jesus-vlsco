import { IsString, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, JopTitle } from '@prisma/client';

export class AddProfileDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ enum: JopTitle, example: JopTitle.BACK_END_DEVELOPER })
  @IsEnum(JopTitle)
  jobTitle: JopTitle;

  @ApiProperty({ example: 'Engineering' })
  @IsString()
  department: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ example: '1990-01-01T00:00:00Z', description: 'Date of Birth in ISO format' })
  @IsDateString()
  dob: Date;

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'American' })
  @IsString()
  nationality: string;

  @ApiProperty({ example: 'e4d1c5d2-b41d-4c6a-9b0c-55b6bca0e2a1' })
  @IsUUID()
  userId: string;
}
