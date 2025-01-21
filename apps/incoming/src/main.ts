import { NestFactory } from '@nestjs/core';

import { MainModule } from './modules';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MainModule);
  await app.listen();
  console.log(`🟢 Incoming Module working at background 🟢\n`);
}
bootstrap();
