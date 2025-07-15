import { IsDateString, IsEnum, IsString } from 'class-validator';
import { Gender, JopTitle } from '@prisma/client';

export class AddProfileInput {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  profileUrl: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsEnum(JopTitle)
  jobTitle: JopTitle;

  @IsString()
  department: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  nationality: string;

  @IsDateString()
  dob: Date;
}
