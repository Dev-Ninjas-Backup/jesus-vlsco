import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { ENVEnum } from './common/enum/env.enum';
import { AllExceptionsFilter } from './common/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // * removes unexpected fields
      forbidNonWhitelisted: true, // * throws error if unknown field is present
      transform: true, // * auto-transform payloads to DTO instances
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // * Swagger config
  const config = new DocumentBuilder()
    .setTitle('Jesus VLSCO')
    .setDescription('Jesus VLSCO API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(configService.get<string>(ENVEnum.PORT) ?? '3000', 10);
  await app.listen(port);
}

void bootstrap();
