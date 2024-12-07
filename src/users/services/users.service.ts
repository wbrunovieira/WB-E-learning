import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: any) {
    const user = await this.usersRepository.createUser(data);
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    return user;
  }
}
