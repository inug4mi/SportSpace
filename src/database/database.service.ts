import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Comentado temporalmente para no exigir una DB activa al arrancar
    // await this.$connect();
  }

  async onModuleDestroy() {
    // await this.$disconnect();
  }
}