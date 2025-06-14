import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { User } from '@prisma/client';
import { HashService } from 'src/common/hash/hash.service';

interface FindPaginatedOptions {
  search?: string;
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashService,
    private readonly repo: UserRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto, avatarFile?: Express.Multer.File) {
    // بررسی اینکه آیا ایمیل قبلاً در دیتابیس وجود دارد
    const emailExists = await this.checkUserExists(createUserDto.email);
    const phoneExists = await this.checkUserByPhoneNumber(
      createUserDto.phoneNumber,
    );

    if (phoneExists) {
      throw new ConflictException('این شماره همراه قبلاً ثبت شده است.');
    }

    if (emailExists) {
      throw new ConflictException('این ایمیل قبلاً ثبت شده است.');
    }

    // هش کردن رمز عبور
    createUserDto.password = await this.hashService.hash(
      createUserDto.password,
    );

    // اگر ایمیل تکراری نباشد، کاربر جدید ساخته می‌شود
    return this.repo.create(createUserDto);
  }

  async findAllPaginated(
    options: FindPaginatedOptions,
  ): Promise<{ users: User[]; totalPages: number; totalCount: number }> {
    const { search = '', page = 1, limit = 10 } = options;

    // کل داده‌ها
    const allUsers = await this.repo.findAll(); // در صورت استفاده از ORM مثل Prisma، بهتره اینجا query مستقیم بزنی

    // فیلتر بر اساس سرچ
    const filtered = allUsers.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1); // حداقل یک صفحه

    // جلوگیری از صفحه اشتباه
    const safePage = Math.min(Math.max(page, 1), totalPages);

    // برش داده برای صفحه فعلی
    const paginated = filtered.slice((safePage - 1) * limit, safePage * limit);

    return {
      users: paginated,
      totalPages,
      totalCount: filtered.length,
    };
  }

  async findByPhoneOrEmail(identifier: string): Promise<User | undefined> {
    return this.repo.findByPhoneNumber(identifier);
  }

  private async findUserOrFail(id: number) {
    const user = await this.repo.findOne(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `کاربر با شناسه ${id} یافت نشد`,
          error: 'User Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.repo.findUserById(id);
    if (!user) {
      throw new NotFoundException('کاربر پیدا نشد');
    }

    // بررسی تکراری بودن فقط در صورت تغییر واقعی
    if (
      updateUserDto.phoneNumber &&
      String(updateUserDto.phoneNumber) !== String(user.phoneNumber)
    ) {
      const existing = await this.repo.findByPhoneNumber(
        updateUserDto.phoneNumber,
      );
      if (existing && existing.id !== user.id) {
        throw new BadRequestException('شماره همراه قبلاً ثبت شده');
      }
    }

    // اگر رمز جدید نیومده، رمز قبلی رو حفظ کن
    if (!updateUserDto.password) {
      delete updateUserDto.password;
    } else {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }

    if (updateUserDto.phoneNumber === user.phoneNumber) {
      delete updateUserDto.phoneNumber;
    }
    return this.repo.update(id, updateUserDto);
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.repo.findUserByEmail(email);
    return !!user;
  }

  private async checkUserByIdExists(id: number): Promise<boolean> {
    const user = await this.repo.findUserById(id);
    return !!user;
  }

  private async checkUserByPhoneNumber(phoneNumber: string): Promise<boolean> {
    const user = await this.repo.findUserByPhoneNumber(phoneNumber);
    return !!user;
  }

  async findOne(id: number) {
    const user = await this.findUserOrFail(id);
    return user;
  }

  async remove(id: number) {
    const user = await this.findUserOrFail(id);
    return this.repo.remove(id);
  }
}
