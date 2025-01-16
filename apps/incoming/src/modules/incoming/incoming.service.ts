import { Injectable } from '@nestjs/common';

@Injectable()
export class IncomingService {
  getHello(): string {
    return 'Hello World!';
  }
}
