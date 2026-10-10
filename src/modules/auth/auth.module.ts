import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../database/database.module'; // Ajusta la ruta según tu estructura
import { JwtStrategy } from './strategies/jwt.strategy';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      global: true, // Opcional, permite usar el JwtService sin reimportarlo en otros módulos si lo necesitas
      secret: process.env.JWT_ACCESS_SECRET || 'super-secret-key',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' },
    } as any),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Ventana de tiempo: 1 minuto
        limit: 5,   // Límite estricto de intentos para prevenir fuerza bruta en login (RNF-03)
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {} 
