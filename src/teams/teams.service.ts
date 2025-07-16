import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import TeamRepository from './repository/team.respository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from '@prisma/client';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}
@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamRepository) {}
  // ss
  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ teams: Team[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;

    // کل داده‌ها
    const allTeams = await this.repo.findAll();

    // فیلتر بر اساس سرچ
    const filtered = allTeams.filter((team) =>
      `${team.id}`.toLowerCase().includes(search.toLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1); // حداقل یک صفحه

    // جلوگیری از صفحه اشتباه
    const safePage = Math.min(Math.max(page, 1), totalPages);

    // برش داده برای صفحه فعلی
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      teams: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async create(createTeamDto: CreateTeamDto) {
    return this.repo.create(createTeamDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    return this.repo.findUnique(id);
  }

  private async findOrFail(id: number) {
    const team = await this.repo.findUnique(id);
    if (!team) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `آیتم با شناسه ${id} یافت نشد`,
          error: 'Team Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.repo.update(id, updateTeamDto);
  }

  async remove(id: number) {
    const team = await this.findOrFail(id);

    const usedInMatch = await this.repo.usedInMatch(id);

    if (usedInMatch) {
      throw new BadRequestException(
        'این تیم در مسابقه‌ای استفاده شده و نمی‌توان آن را حذف کرد',
      );
    }

    return this.repo.remove(id);
  }
}
