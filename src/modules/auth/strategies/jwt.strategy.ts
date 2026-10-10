import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rechaza automáticamente tokens expirados
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_change_me',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Lo que retornemos aquí se adjunta a req.user en los endpoints protegidos
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token de acceso inválido.');
    }
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}