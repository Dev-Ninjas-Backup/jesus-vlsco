import { ApiProperty } from '@nestjs/swagger';
import { VisibilityType } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AddRecognitionDto {
  @ApiProperty({
    example: 'c7f05a0e-1234-4abc-8a93-87f0145719e6',
    description: 'The ID of the badge associated with the recognition.',
  })
  @IsString()
  @IsNotEmpty()
  badgeId: string;

  @ApiProperty({
    example: 'Congratulations on your promotion!',
    description: 'The recognition message to be shared.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: VisibilityType.All_user_in_the_company,
    enum: VisibilityType,
    description: 'Controls who can see this recognition.',
  })
  @IsEnum(VisibilityType)
  visibility: VisibilityType;

  @ApiProperty({
    example: true,
    description: 'If true, notify recipients (e.g., via email or app).',
  })
  @IsBoolean()
  shouldNotify: boolean;

  @ApiProperty({
    example: true,
    description: 'If true, users are allowed to like this recognition.',
  })
  @IsBoolean()
  isAllowedToLike: boolean;

  @ApiProperty({
    example: [
      'd27f0c35-a2f9-4827-b0ce-f33eab91b789',
      'e14d5f6a-dc65-4e88-814f-59cdfe25bb62',
    ],
    description: 'List of user IDs who are recipients of the recognition.',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  recognitionUserIds: string[];
}
