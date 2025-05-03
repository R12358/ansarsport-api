import {
  Injectable,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberRepository } from './repository/member.repository';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private readonly repo: MemberRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    return this.findMemberOrFail(id);
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
