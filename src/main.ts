import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { cwd } from 'node:process';
import { parse } from 'yaml';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = await readFile(resolve(cwd(), 'doc', 'api.yaml'), {
    encoding: 'utf-8',
  });
  SwaggerModule.setup('doc', app, parse(document));

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  process.on('uncaughtException', (error) => {
    console.error(`Uncaught Exception: ${error.message}`, error.stack);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(
      `Unhandled Rejection at: ${promise} reason: ${reason}`,
    );
  });
}
bootstrap();
