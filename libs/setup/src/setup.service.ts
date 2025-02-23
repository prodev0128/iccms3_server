import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { LoggingInterceptor } from '@app/setup/interceptor/logging.interceptor';

import { SwaggerInfoDto } from './dto/swagger-info.dto';

@Injectable()
export class SetupService {
  static setupSwagger(app: INestApplication, info: SwaggerInfoDto = {}) {
    const config = new DocumentBuilder()
      .setTitle(info.title || 'ICCMS3 API DOCUMENTATION')
      .setDescription(info.description || 'The API documentation for ICCMS3')
      .setVersion(info.version || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);
  }

  static setupApiLogger(app: INestApplication, logger: Logger) {
    app.useGlobalInterceptors(new LoggingInterceptor(logger));
  }
}
