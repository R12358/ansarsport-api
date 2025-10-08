import {
  IsInt,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { MatchType } from '@prisma/client';

export class CreateMatchDto {
  @Type(() => Number)
  homeTeamId: number;

  @Type(() => Number)
  awayTeamId: number;

  @Transform(({ value }) => new Date(value).toISOString())
  // @IsDateString()
  matchDate: string; // تاریخ به صورت string وارد می‌شود که بعداً به Date تبدیل خواهد شد

  // @IsEnum(MatchType)
  matchType: MatchType;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  homeScore?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  awayScore?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
