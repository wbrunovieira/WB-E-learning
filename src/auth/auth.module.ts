import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { jwtConstants } from 'src/config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        privateKey: jwtConstants.privateKey,
        publicKey: jwtConstants.publicKey,
        signOptions: { expiresIn: jwtConstants.expiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
