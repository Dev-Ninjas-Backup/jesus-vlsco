import { UserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddProfileInput } from './add-profile-info.dto';

export class AddUserDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsInt()
  employeeID: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsEnum(UserEnum)
  role: UserEnum;

  @IsBoolean()
  isLogin: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsInt()
  pinCode: number;

  @ValidateNested()
  @Type(() => AddProfileInput)
  profile: AddProfileInput;
}
