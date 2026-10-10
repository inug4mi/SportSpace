import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() // Hace que el servicio esté disponible en toda la app sin necesidad de importarlo en cada módulo
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}