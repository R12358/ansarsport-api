import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsInt,
  IsUrl,
  IsISO8601,
} from 'class-validator';

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
  @IsOptional() // viewCount اختیاری است و اگر داده نشود به طور پیش‌فرض 0 تنظیم می‌شود
  viewCount?: number;

  @IsBoolean()
  @IsOptional() // isFeatured اختیاری است و به طور پیش‌فرض false تنظیم می‌شود
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional() // isHighlighted اختیاری است و به طور پیش‌فرض false تنظیم می‌شود
  isHighlighted?: boolean;

  @IsBoolean()
  @IsOptional() // isTopNews اختیاری است و به طور پیش‌فرض false تنظیم می‌شود
  isTopNews?: boolean;
}
