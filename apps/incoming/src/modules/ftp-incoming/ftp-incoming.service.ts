import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class FtpIncomingService {
  @OnEvent('file.added')
  handleFileAddedEvent(filename: string) {
    console.log(`File added: ${filename}`);
    // Perform actions after file creation
  }

  @OnEvent('file.changed')
  handleFileChangedEvent(filename: string) {
    console.log(`File changed: ${filename}`);
    // Perform actions after file modification
  }

  @OnEvent('file.removed')
  handleFileRemovedEvent(filename: string) {
    console.log(`File changed: ${filename}`);
    // Perform actions after file modification
  }
}
