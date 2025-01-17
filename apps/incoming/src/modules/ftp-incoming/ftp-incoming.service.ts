import { Injectable } from '@nestjs/common';

@Injectable()
export class FtpIncomingService {
  getHello(): string {
    return 'Hello World!';
  }
}
