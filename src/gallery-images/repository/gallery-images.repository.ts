import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryImageDto } from '../dto/createGalleryImageDto';
import { UpdateGalleryImageDto } from '../dto/updateGalleryImageDto';

@Injectable()
export class GalleryImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGalleryImagesDto: CreateGalleryImageDto) {
    return this.prisma.galleryImage.create({ data: createGalleryImagesDto });
  }

  async findAll() {
    return this.prisma.galleryImage.findMany({
      include: {
        gallery: true,
      },
    });
  }

  async findGalleryImagesByGalleryId(galleryId: number) {
    return this.prisma.galleryImage.findMany({
      where: {
        galleryId: galleryId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.galleryImage.findUnique({ where: { id } });
  }

  async update(id: number, updateGalleryImageDto: UpdateGalleryImageDto) {
    return this.prisma.galleryImage.update({
      where: { id },
      data: updateGalleryImageDto,
    });
  }

  async delete(id: number) {
    return this.prisma.galleryImage.delete({ where: { id } });
  }
}
