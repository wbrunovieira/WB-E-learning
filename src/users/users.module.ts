import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService, UsersRepository], // Exportamos o UsersService e UsersRepository para uso em outros módulos
})
export class UsersModule {}
