import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad en cabeceras HTTP
  app.use(helmet());

  // Habilitar cookie-parser para cookies HttpOnly
  app.use(cookieParser());

  // Prefijo global para la API (crucial para /api/v1)
  app.setGlobalPrefix('api/v1');

  // CORS configurado para React / Vite (puerto 5173)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // Validaciones globales (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en: http://localhost:${port}/api/v1`);
}

bootstrap();