import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateSliderDto {
  imageUrl: string;

  @IsString()
  linkUrl: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  order?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(
    ({ value }) =>
      value === 'true' || value === true || value === 1 || value === '1',
  )
  isActive?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
