import { Type } from 'class-transformer';
import { IsInt, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { MatchType } from '@prisma/client';

export class UpdateMatchDto {
  @IsInt()
  @Type(() => Number)
  homeTeamId: number;

  @IsInt()
  @Type(() => Number)
  awayTeamId: number;

  @Type(() => Date) // تبدیل خودکار به Date
  @IsDate() // حالا انتظار می‌رود یک Date به عنوان ورودی داشته باشیم
  matchDate: Date;

  @IsEnum(MatchType)
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
