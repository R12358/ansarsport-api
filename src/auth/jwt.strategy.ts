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
          return req.cookies.token;
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email };
  }
}
