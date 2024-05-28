import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port');

  await app.listen(config.get<number>('app.port'));
  console.log(`app listening on port ${port}...`);
}
bootstrap();
