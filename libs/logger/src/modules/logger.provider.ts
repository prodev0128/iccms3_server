import { Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
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

  private async ensureLogFile() {
    const logDir = path.dirname(this.logFilePath);
    try {
      if (!fs.existsSync(logDir)) {
        await fs.mkdir(logDir, { recursive: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  private async writeToFile(message: string, type: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${type} [${this.appName}] ${message}`;
    try {
      await fs.appendFile(this.logFilePath, formattedMessage + '\n');
    } catch (error) {
      console.log(error);
    }
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
