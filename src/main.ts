import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://ansarsport.ir', 'http://localhost:3000'],
    credentials: true, // اگر از کوکی یا هدر خاص استفاده می‌کنی
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true })); // حتما transform: true باشه
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
//
