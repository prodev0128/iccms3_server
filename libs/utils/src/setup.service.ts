import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SwaggerInfoDto } from '@app/utils/dto/swaggerInfo.dto';

import { LoggerMiddleware } from './middleware/logger.middleware';

export const setupSwagger = (app: INestApplication, info: SwaggerInfoDto = {}) => {
  const config = new DocumentBuilder()
    .setTitle(info.title || 'ICCMS3 API DOCUMENTATION')
    .setDescription(info.description || 'The API documentation for ICCMS3')
    .setVersion(info.version || '1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
};

export const setupLogger = (app: INestApplication, logger: Logger) => {
  const loggerMiddleware = new LoggerMiddleware(logger);
  app.use(loggerMiddleware.use.bind(loggerMiddleware)); // Bind the middleware function
};
