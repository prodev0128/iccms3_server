import { NestFactory } from '@nestjs/core';
import { CustomTransportStrategy } from '@nestjs/microservices';

import { MainModule } from './modules/module';

class KeepAliveStrategy implements CustomTransportStrategy {
  private closing = false;

  wait() {
    if (!this.closing) {
      setTimeout(() => this.wait(), 1000);
    }
  }

  listen(callback: () => void) {
    callback();
    this.wait();
  }

  close() {
    this.closing = true;
  }
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MainModule, {
    strategy: new KeepAliveStrategy(),
  });
  await app.listen();
}
bootstrap();
