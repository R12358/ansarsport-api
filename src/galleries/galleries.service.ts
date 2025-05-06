import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GalleryRepository } from './repository/gallery.repository';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleriesService {
  constructor(private readonly repo: GalleryRepository) {}

  async create(createGalleryDto: CreateGalleryDto) {
    return this.repo.create(createGalleryDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  private async findOrFail(id: number) {
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

  async findOne(id: number) {
    const gallery = this.findOrFail(id);
    return this.repo.findOne(id);
  }

  async update(id: number, updateGalleryDto: UpdateGalleryDto) {
    const gallery = this.findOrFail(id);
    return this.repo.update(id, updateGalleryDto);
  }

  async remove(id: number) {
    const gallery = this.findOrFail(id);
    return this.repo.remove(id);
  }
}
