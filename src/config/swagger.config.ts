import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

// export const SwaggerConfig: OpenAPIObject = {
//   openapi: '3.1.0',
//   paths: {},
//   info: {
//     title: 'NestJS Board Project API',
//     description: 'API document for NestJS Board project',
//     version: '1.0',
//   },
// };

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('NestJS Board Project API')
  .setDescription('API document for NestJS Board project')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
      bearerFormat: 'Token',
    },
    'accessToken',
  )
  .build();
