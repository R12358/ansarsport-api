import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberRepository } from './repository/member.repository';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from '@prisma/client';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class MembersService {
  constructor(private readonly repo: MemberRepository) {}

  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ members: Member[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;

    // کل اعضا
    const allMembers = await this.repo.findAll();

    // فیلتر براسسا سرچ
    const filtered = allMembers.filter((member) =>
      `${member.id} ${member.id} ${member.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    // جلوگیری از صفحه اشتباه
    const safePage = Math.min(Math.max(page, 1), totalPages);

    // برش داده برای صفحه فعلی
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      members: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async findOne(id: number) {
    return this.findMemberOrFail(id);
  }

  async findByUserId(id: number) {
    return this.repo.findByUserId(id);
  }
  private async findMemberOrFail(id: number) {
    const member = await this.repo.findOne(id);
    if (!member) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `عضو با شناسه ${id} یافت نشد`,
          error: 'Member Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return member;
  }

  async create(dto: CreateMemberDto) {
    const existing = await this.repo.findByUserId(dto.userId);
    if (existing) {
      throw new BadRequestException('این کاربر قبلاً عضو شده است.');
    }
    return this.repo.create(dto);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    return this.repo.update(id, updateMemberDto);
  }

  async remove(id: number) {
    const member = this.findMemberOrFail(id);
    return this.repo.remove(id);
  }
}
