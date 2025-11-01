import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ validar DTOs globalmente
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  // ✅ permitir CORS para apps móviles / frontend
  app.enableCors();

  // ✅ IMPORTANTE PARA RAILWAY: escuchar el puerto dinámico y en 0.0.0.0
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on port ${port}`);
}
bootstrap();
