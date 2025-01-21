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

  private writeToFile(message: string) {
    fs.appendFileSync(this.logFilePath, message + '\n');
  }

  private printLog(message: string, type: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `${timestamp} ${type} [${this.appName}] ${message}`;
    super.log(message); // Log to Console
    this.writeToFile(formattedMessage); // Log to File
  }

  log(message: string) {
    this.printLog(message, 'LOG');
  }

  error(message: string) {
    this.printLog(message, 'ERROR');
  }

  warn(message: string) {
    this.printLog(message, 'WARN');
  }
}
