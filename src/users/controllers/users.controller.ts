import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Rota POST para criar um usuário
   * @param body - Dados do usuário
   */
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.createUser(body);
    return user;
  }

  /**
   * Rota GET para obter um usuário pelo email
   * @param email - Email do usuário
   */
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    const user = await this.usersService.findUserByEmail(email);
    return user;
  }
}
