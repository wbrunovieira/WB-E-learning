import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Valida as credenciais do usuário.
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns O usuário se as credenciais forem válidas
   */
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const passwordMatches = await this.comparePassword(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return user;
  }

  /**
   * Realiza o login e gera o Access Token e o Refresh Token
   * @param user - Dados do usuário
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Salva o refresh token no banco de dados
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Atualiza o Access Token usando o Refresh Token
   * @param refreshToken - O Refresh Token enviado pelo cliente
   */
  async refresh(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new ForbiddenException('O refresh token expirou.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const payload = { email: user.email, sub: user.id };

    const newAccessToken = this.generateAccessToken(payload);
    const newRefreshToken = this.generateRefreshToken(payload);

    await this.prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Registra um novo usuário com senha criptografada
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @param name - Nome do usuário
   */
  async registerUser(email: string, password: string, name: string) {
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return user;
  }

  /**
   * Compara uma senha em texto plano com a senha criptografada
   * @param plainPassword - Senha em texto plano
   * @param hashedPassword - Senha criptografada
   */
  async comparePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Criptografa a senha antes de salvar no banco de dados
   * @param plainPassword - Senha em texto plano
   */
  async hashPassword(plainPassword: string) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  /**
   * Gera o Access Token
   * @param payload - Payload do JWT
   */
  generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '15m', // 15 minutos de validade
    });
  }

  /**
   * Gera o Refresh Token
   * @param payload - Payload do JWT
   */
  generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      expiresIn: '7d', // 7 dias de validade
    });
  }
}
