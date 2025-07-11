import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Fabricantes de Vehículos')
    .setDescription('API para obtener información de fabricantes de vehículos desde NHTSA')
    .setVersion('1.0')
    .addTag('Fabricantes de Vehículos')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
