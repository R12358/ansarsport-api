import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from '../dto/create-gallery.dto';
import { UpdateGalleryDto } from '../dto/update-gallery.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GalleryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(updateGalleryDto: UpdateGalleryDto) {
    const data = {
      ...updateGalleryDto,
      publishedAt: updateGalleryDto.publishedAt
        ? new Date(updateGalleryDto.publishedAt)
        : new Date(),
    };
    return this.prisma.gallery.create({ data });
  }

  async findAll() {
    return this.prisma.gallery.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: number) {
    return this.prisma.gallery.findFirst({ where: { id, deletedAt: null } });
  }

  async update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return this.prisma.gallery.update({
      where: { id },
      data: updateGalleryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.gallery.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
