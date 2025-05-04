import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NewsRepository } from './repository/news.repository';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly repo: NewsRepository) {}

  async create(createNewsDto: CreateNewsDto) {
    const data = {
      ...createNewsDto,
      publishedAt: createNewsDto.publishedAt
        ? new Date(createNewsDto.publishedAt).toISOString()
        : new Date().toISOString(),
    };

    return this.repo.create(data);
  }

  private async findOrFail(id: number) {
    const news = await this.repo.findOne(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `خبر با شناسه ${id} یافت نشد`,
          error: 'News Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const news = this.findOrFail(id);
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = await this.findOrFail(id);
    return this.repo.update(id, updateNewsDto);
  }
  async remove(id: number) {
    const news = this.findOrFail(id);
    return this.repo.remove(id);
  }
}
