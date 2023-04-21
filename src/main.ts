import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { validationFormatErrorsHelper } from './utils/validationFormatErrorsHelper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(validationFormatErrorsHelper(errors));
      },
    }),
  );
  app.setGlobalPrefix('api');

  await app.listen(7000);
}
bootstrap();
