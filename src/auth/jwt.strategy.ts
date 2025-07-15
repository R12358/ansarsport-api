// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        // بخونه از کوکی به جای هدر
        if (req?.cookies?.token) {
          console.log('JWT TOKEN FROM COOKIE:', req.cookies.token); // 👈 دیباگ
          return req.cookies.token;
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET',
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      role: payload.role,
      userId: payload.sub,
      email: payload.email,
    };
  }
}
