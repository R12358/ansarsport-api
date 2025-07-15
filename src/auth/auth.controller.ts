import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/Login.dto';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // مسیر درست رو وارد کن

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    // هر چیز دیگه‌ای که توی توکن هست
    email?: string;
    role?: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('توکن نامعتبر است.');
    }

    return this.usersService.findById(+userId); // id رو به عدد تبدیل میکنیم
  }
}
