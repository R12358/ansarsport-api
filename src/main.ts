import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // جایی که فرانت اجرا میشه
    credentials: true, // اگر از کوکی یا هدر خاص استفاده می‌کنی
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true })); // حتما transform: true باشه
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
//
