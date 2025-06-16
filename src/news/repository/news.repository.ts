import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from '../dto/create-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateNewsDto } from '../dto/update-news.dto';

@Injectable()
export class NewsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  async findFeaturedNews() {
    return this.prisma.news.findMany({ where: { isFeatured: true } });
  }

  async findHighlightedNews() {
    return this.prisma.news.findMany({ where: { isHighlighted: true } });
  }

  async findLastestNews() {
    return this.prisma.news.findMany({ where: { isTopNews: true } });
  }

  async findAll() {
    return this.prisma.news.findMany({ where: { deletedAt: null } });
  }

  async findOne(id: number) {
    return this.prisma.news.findFirst({ where: { id } });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  async remove(id: number) {
    return this.prisma.news.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
