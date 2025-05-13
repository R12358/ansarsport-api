import { Type } from 'class-transformer';
import { IsInt, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { MatchType } from '@prisma/client';

export class UpdateMatchDto {
  @IsInt()
  homeTeamId: number;

  @IsInt()
  awayTeamId: number;

  @Type(() => Date) // تبدیل خودکار به Date
  @IsDate() // حالا انتظار می‌رود یک Date به عنوان ورودی داشته باشیم
  matchDate: Date;

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
