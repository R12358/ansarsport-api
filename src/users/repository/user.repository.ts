import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByPhoneNumber(phoneNumber: string) {
    return this.prisma.user.findFirst({ where: { phoneNumber } });
  }

  async findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        avatarUrl: true,
        // چیزای دیگه‌ای که نیاز داری
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      include: { member: true },
    });
  }
  async findFirst(args: Prisma.UserFindFirstArgs): Promise<User | null> {
    return this.prisma.user.findFirst(args);
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async softDelete(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async hardDelete(id: number) {
    // اول همه رکوردهای مربوط به کاربر توی members رو حذف می‌کنیم
    await this.prisma.member.deleteMany({
      where: { userId: id },
    });

    // بعد کاربر رو حذف می‌کنیم
    const deletedUser = await this.prisma.user.deleteMany({
      where: { id },
    });

    // اگه هیچ کاربری حذف نشد، یعنی کاربری با این id وجود نداشته
    if (deletedUser.count === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    return deletedUser;
  }
}
