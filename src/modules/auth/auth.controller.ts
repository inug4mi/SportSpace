import { Controller, Post, Body, Res, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Rate limit: máximo 5 intentos por minuto
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(dto);
    const tokens = await this.authService.generateTokens(user.id, user.email, user.role);

    // Inyección de Refresh Token en Cookie HttpOnly
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      path: '/auth/refresh',
    });

    return {
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard) // <-- Vuelve a activar el Guard aquí
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request & { user: { sub: string, email: string, role: string } },
    @Res({ passthrough: true }) response: Response,
  ) {
    // Aquí ya puedes usar req.user.sub de forma segura si necesitas registrar el evento de salida
    response.clearCookie('refreshToken', { path: '/auth/refresh' });
    return { message: 'Sesión cerrada correctamente.' };
  }
}