import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVideoDto } from '../dto/create-video.dto';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VideosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVideoDto: CreateVideoDto) {
    const data = {
      ...createVideoDto,
      publishedAt: createVideoDto.publishedAt
        ? new Date(createVideoDto.publishedAt)
        : new Date(),
    };

    return this.prisma.video.create({ data });
  }

  async findAll() {
    return this.prisma.video.findMany();
  }

  async findOne(id: number) {
    return this.prisma.video.findFirst({ where: { id } });
  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    return this.prisma.video.update({ where: { id }, data: updateVideoDto });
  }

  async remove(id: number) {
    return this.prisma.video.delete({ where: { id } });
  }
}
