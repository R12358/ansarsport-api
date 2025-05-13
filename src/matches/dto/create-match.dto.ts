import {
  IsInt,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { MatchType } from '@prisma/client';

export class CreateMatchDto {
  @IsInt()
  homeTeamId: number;

  @IsInt()
  awayTeamId: number;

  @IsDateString()
  matchDate: string; // تاریخ به صورت string وارد می‌شود که بعداً به Date تبدیل خواهد شد

  @IsEnum(MatchType)
  matchType: MatchType;

  @IsOptional()
  @IsInt()
  homeScore?: number;

  @IsOptional()
  @IsInt()
  awayScore?: number;

  @IsOptional()
  @IsString()
  location?: string;
}
