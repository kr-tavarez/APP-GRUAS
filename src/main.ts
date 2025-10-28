import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  // await app.listen(3000, '192.168.80.15' || 'localhost');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
