import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NewsRepository } from './repository/news.repository';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from '@prisma/client';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class NewsService {
  constructor(private readonly repo: NewsRepository) {}

  async findFeaturedNews(limit?: number) {
    return this.repo.findFeaturedNews(limit);
  }

  async findHighlightedNews(limit?: number) {
    return this.repo.findHighlightedNews(limit);
  }

  async findLastestNews(limit?: number) {
    return this.repo.findLastestNews(limit);
  }

  async findTopNews(limit?: number) {
    return this.repo.findTopNews(limit);
  }

  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ news: News[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;
    const allNews = await this.repo.findAll();
    const filtered = allNews.filter((news) =>
      `${news.id}`.toLowerCase().includes(search.toLocaleLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(Math.max(page, 1), totalPages);
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      news: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }
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

  async findAll(limit?: number) {
    return this.repo.findAll(limit);
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
