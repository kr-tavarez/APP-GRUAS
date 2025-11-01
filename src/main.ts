import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // <-- Habilita CORS (obligatorio para frontend / app móvil)
  });

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // <-- IMPORTANTE PARA RAILWAY

  console.log(`🚀 Backend on Railway listening on port ${port}`);
}
bootstrap();
