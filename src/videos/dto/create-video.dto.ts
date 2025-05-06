import { IsString, IsOptional, IsUrl, IsISO8601, IsInt } from 'class-validator';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  videoUrl: string;

  @IsOptional()
  @IsString({ message: 'thumbnailUrl must be a string' })
  thumbnailUrl: string;

  @IsOptional()
  @IsISO8601()
  publishedAt?: string;

  @IsOptional()
  @IsInt()
  viewCount?: number;
}
