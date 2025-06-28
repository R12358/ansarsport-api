import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { AgeGroup, Position } from '@prisma/client';

export class UpdateMemberDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  jerseyNumber?: number;

  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @IsOptional()
  @IsEnum(Position)
  position?: Position;
}
