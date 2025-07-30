import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department, Gender, JopTitle, UserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({ example: '8801234567890' })
    @IsString()
    phone: string;
  
    @ApiProperty({ example: 1001 })
    @Type(() => Number)
    @IsInt()
    employeeID: number;
  
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ enum: UserEnum, example: UserEnum.EMPLOYEE })
    @IsEnum(UserEnum)
    role: UserEnum;
  
    @ApiPropertyOptional({ example: 'strongpassword123' })
    @IsOptional()
    @IsString()
    password?: string;
  
    @ApiPropertyOptional({ example: 1234 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    pinCode?: number;
  
    // Profile fields
    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;
  
    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;
  
    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;
  
    @ApiProperty({ enum: JopTitle })
    @IsEnum(JopTitle)
    jobTitle: JopTitle;
  
    @ApiProperty({ enum: Department })
    @IsEnum(Department)
    department: Department;
  
    @ApiProperty()
    @IsString()
    address: string;
  
    @ApiProperty()
    @IsString()
    city: string;
  
    @ApiProperty()
    @IsString()
    state: string;
  
    @ApiProperty()
    @Type(() => Date)
    @IsDate()
    dob: Date;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country?: string;
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    nationality?: string;
}
