import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  const config = new DocumentBuilder()
    .setTitle('ICCMS3 API DOCUMENTATION')
    .setDescription('The API documentation for NestJS with Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port.api') || 3128;
  await app.listen(port);
  console.log(`🟢 Api Module listening at ${port} 🟢\n`);
}

bootstrap();
