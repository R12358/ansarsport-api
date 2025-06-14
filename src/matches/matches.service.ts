import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MatchRepository } from './repository/match.repository';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Match } from '@prisma/client';
interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}
@Injectable()
export class MatchesService {
  constructor(
    private readonly repo: MatchRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ matches: Match[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;

    const allMatches = await this.repo.findAll();

    const filtered = allMatches.filter((match) =>
      `${match.id}`.toLowerCase().includes(search.toLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const safePage = Math.min(Math.max(page, 1), totalPages);

    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      matches: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async create(createMatchDto: CreateMatchDto) {
    const { homeTeamId, awayTeamId } = createMatchDto;

    // بررسی وجود تیم میزبان
    const homeTeam = await this.prisma.team.findUnique({
      where: { id: homeTeamId },
    });
    if (!homeTeam) {
      throw new NotFoundException(
        `تیم میزبان با شناسه ${homeTeamId} پیدا نشد.`,
      );
    }

    // بررسی وجود تیم مهمان
    const awayTeam = await this.prisma.team.findUnique({
      where: { id: awayTeamId },
    });
    if (!awayTeam) {
      throw new NotFoundException(`تیم مهمان با شناسه ${awayTeamId} پیدا نشد.`);
    }

    // ایجاد مسابقه
    return this.repo.create(createMatchDto);
  }

  async findOne(id: number) {
    const item = await this.repo.findOne(id);
    if (!item) {
      throw new NotFoundException('آیتم یافت نشد');
    }
    return this.repo.findOne(id);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const match = await this.findOrFail(id);
    return this.repo.update(id, updateMatchDto);
  }

  async remove(id: number) {
    const match = await this.findOrFail(id);
    return this.repo.remove(id);
  }

  private async findOrFail(id: number) {
    const item = await this.repo.findOne(id);
    if (!item) {
      throw new NotFoundException('آیتم یافت نشد');
    }
    return item;
  }
}
