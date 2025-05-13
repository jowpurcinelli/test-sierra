import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config/environment.config';

// import * as multipart from '@fastify/multipart';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  
  
  const fastifyInstance = app.getHttpAdapter().getInstance();
  
  await fastifyInstance.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 5 * 1024 * 1024, 
    }
  });
  
  
  
  
  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  
  const config = new DocumentBuilder()
    .setTitle('Personal Link Hub API')
    .setDescription('API documentation for the Personal Link Hub application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('links', 'Link management endpoints')
    .addTag('profiles', 'Profile management endpoints')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  const port = env.PORT;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`API Documentation available at: ${await app.getUrl()}/api/docs`);
  console.log(`Static files are served from: ${join(process.cwd(), 'public')}`);
}

bootstrap(); 