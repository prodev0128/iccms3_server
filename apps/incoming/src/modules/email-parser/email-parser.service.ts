import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs-extra';
import * as MailComposer from 'mailcomposer';
import { simpleParser } from 'mailparser';
import * as path from 'path';

@Injectable()
export class EmailParserService {
  constructor(
    @Inject('GLOBAL_LOGGER') private readonly logger: Logger,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async parseEmail(orgPath: string, destDir: string) {
    try {
      const emailContent = await fs.readFile(orgPath);
      const parsed = await simpleParser(emailContent);

      // Save attachments
      for (const attachment of parsed.attachments) {
        const attachmentPath = path.join(destDir, attachment.filename);
        await fs.writeFile(attachmentPath, attachment.content);
      }
      return parsed;
    } catch (error) {
      this.logger.error('EmailParseService/parseEmail:', error.message);
      throw error;
    }
  }

  async composeEmail(destDir: string, parsed: any) {
    const mailOptions = { ...parsed };

    // Remove attachments
    delete mailOptions.attachments;

    // To, From field
    Object.keys(mailOptions).forEach((key) => {
      if (mailOptions[key]?.text) {
        mailOptions[key] = mailOptions[key].text;
      }
    });

    // mail compose
    const mail = new MailComposer(mailOptions);

    // mail build
    return new Promise<void>((resolve, reject) => {
      mail.build(async (error: any, message: any) => {
        if (error) {
          this.logger.error('EmailParserService/composeEmail:', error.message);
          reject(error);
          return;
        }
        const destPath = path.join(destDir, '0.eml');
        await fs.writeFile(destPath, message);
        resolve();
      });
    });
  }

  async start(instanceID: string, orgPath: string) {
    try {
      if (!fs.existsSync(orgPath)) {
        this.logger.error('EmailParseService/start:', orgPath);
        return;
      }

      // make dir
      const destDir = orgPath.replace(/\.[^/.]+$/, '');
      await fs.mkdir(destDir, { recursive: true });

      // parse & compose email
      const parsedEmail = await this.parseEmail(orgPath, destDir);
      await this.composeEmail(destDir, parsedEmail);

      // emit event
      this.eventEmitter.emit(`email.parsed.${instanceID}`, destDir);
    } catch (error) {
      this.logger.error('EmailParseService/start:', orgPath, error.message);
    }
  }
}
