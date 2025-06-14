import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGalleryImageDto } from './dto/createGalleryImageDto';
import { GalleryImageRepository } from './repository/gallery-images.repository';
import { UpdateGalleryImageDto } from './dto/updateGalleryImageDto';
import { GalleryImage } from '@prisma/client';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import * as path from 'path';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class GalleryImagesService {
  constructor(
    private readonly repo: GalleryImageRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createGalleryImageDto: CreateGalleryImageDto) {
    return this.repo.create(createGalleryImageDto);
  }

  async findOrFail(id: number) {
    const item = await this.repo.findOne(id);
    if (!item) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `آیتم با شناسه ${id} یافت نشد`,
          error: 'Item Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return item;
  }

  async findAllPaginated(options: FindPaginatedOptions): Promise<{
    galleryImages: GalleryImage[];
    totalPages: number;
    totalCount: number;
  }> {
    const { search = '', page = 1, limit = 10 } = options;
    const allGalleryImages = await this.repo.findAll();
    const filtered = allGalleryImages.filter((gallery) =>
      `${gallery.id}`.toLowerCase().includes(search.toLocaleLowerCase()),
    );
    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);
    return {
      galleryImages: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number): Promise<GalleryImage> {
    await this.findOrFail(id); // اگه وجود نداشت، خطا بده
    const galleryImage = await this.repo.findOne(id);
    return galleryImage;
  }

  async update(id: number, updateGalleryImageDto: UpdateGalleryImageDto) {
    return this.repo.update(id, updateGalleryImageDto);
  }

  async delete(id: number) {
    const galleryImage = await this.findOrFail(id);

    if (galleryImage.imageUrl) {
      const filename = path.basename(galleryImage.imageUrl); // فقط نام فایل
      await this.fileUploadService.removeFile('gallery-images', filename); // حذف فایل قبلی
    }

    return this.repo.delete(id);
  }
}
