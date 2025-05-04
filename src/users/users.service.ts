import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class UsersService {
  constructor(
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

    // اگر ایمیل تکراری نباشد، کاربر جدید ساخته می‌شود
    return this.repo.create(createUserDto);
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

    if (updateUserDto.email === user.email) {
      delete updateUserDto.email;
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

  async findAll() {
    return this.repo.findAll();
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
