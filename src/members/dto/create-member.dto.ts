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
import { AgeGroup } from '@prisma/client';

export class CreateMemberDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  jerseyNumber?: number;

  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @IsInt()
  positionId: number;

  @IsInt()
  userId: number;
}
