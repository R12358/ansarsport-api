import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  IsUrl,
  IsISO8601,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional() // چون description می‌تواند اختیاری باشد
  description?: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsISO8601()
  publishedAt: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  viewCount?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isHighlighted?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isTopNews?: boolean;
}
