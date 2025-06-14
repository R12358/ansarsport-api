import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isActive: boolean;
}
