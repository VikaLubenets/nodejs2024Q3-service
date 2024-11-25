import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'node:process';
import { parse } from 'yaml';
import { LoggingService } from './modules/logging/logging.service';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  app.useGlobalPipes(new ValidationPipe());

  const document = await readFile(resolve(cwd(), 'doc', 'api.yaml'), {
    encoding: 'utf-8',
  });
  SwaggerModule.setup('doc', app, parse(document));

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}
bootstrap();
