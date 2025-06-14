import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateGalleryImageDto {
  @IsInt()
  @Type(() => Number)
  galleryId: number;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsInt()
  @Type(() => Number)
  order?: number;
}
