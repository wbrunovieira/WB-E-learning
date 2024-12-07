import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  email: string;

  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;
}
