import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://seusite.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(helmet());

  app.setGlobalPrefix('api/v1');

  const PORT = process.env.PORT || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message:
        'Muitas requisições a partir deste IP, tente novamente mais tarde.',
    }),
  );

  app.enableShutdownHooks();

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  await app.listen(PORT);
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/api/v1`);
}

bootstrap();
