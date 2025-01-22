import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class FileLogger extends Logger {
  private readonly logFilePath: string;

  constructor(
    context: string,
    private readonly appName: string,
  ) {
    super(context);
    this.logFilePath = path.join(process.cwd(), 'logs', `${this.appName}.log`);
    this.ensureLogFile();
  }

  private ensureLogFile() {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  private writeToFile(message: string, type: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${type} [${this.appName}] ${message}`;
    fs.appendFileSync(this.logFilePath, formattedMessage + '\n');
  }

  log(...messages: string[]) {
    const message = messages.join(' ');
    super.log(message); // Log to Console
    this.writeToFile(message, 'LOG');
  }

  error(...messages: string[]) {
    const message = messages.join(' ');
    super.error(message); // Log to Console
    this.writeToFile(message, 'ERROR');
  }

  warn(...messages: string[]) {
    const message = messages.join(' ');
    super.warn(message); // Log to Console
    this.writeToFile(message, 'WARN');
  }
}
