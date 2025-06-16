import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/Login.dto';
import { User } from '@prisma/client';
type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto): Promise<UserWithoutPassword | null> {
    const user = await this.userService.findByPhoneOrEmail(dto.identifier);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, phoneNumber: user.phoneNumber };

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h', // ⏰ انقضای توکن: یک ساعت
      }),
      user,
    };
  }
}
