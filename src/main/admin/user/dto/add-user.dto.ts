import { IsBoolean, IsEmail, IsEnum, IsIn, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEnum } from '@prisma/client';
import { AddProfileInput } from './add-profile-info.dto';

export class AddUserDto {
  @IsOptional()
  @IsInt()
  phone?: number;

  @IsOptional()
  @IsInt()
  employeeID?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

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
