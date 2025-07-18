import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as pack from '../package.json';
import { createResponseFromErrorsList } from './common/validation/exception.factory';

export function configureApp(app: INestApplication): INestApplication {
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) =>
        new BadRequestException(createResponseFromErrorsList(errors)),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setVersion(pack.version)
    .addServer('http://localhost', 'local')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app;
}
