import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs-extra';
import * as MailComposer from 'mailcomposer';
import { simpleParser } from 'mailparser';
import * as path from 'path';

@Injectable()
export class EmailParserService {
  private eventEmitter = new EventEmitter2();

  constructor(@Inject('GLOBAL_LOGGER') private readonly logger: Logger) {}

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
    } catch (e) {
      this.logger.error('EmailParserService/parseEmail:', e.message);
      throw e;
    }
  }

  async composeEmailWithoutAttachment(destDir: string, parsed: any) {
    for (const key in parsed) {
      if (key === 'attachments') {
        delete parsed[key];
      } else if (parsed[key].text) {
        parsed[key] = parsed[key].text;
      }
    }
    const mailOptions = { ...parsed };
    console.log('mailOptions', { ...mailOptions });

    const mail = new MailComposer({ ...mailOptions });
    mail.build(async (err: any, message: any) => {
      if (err) {
        return;
      }
      const destPath = path.join(destDir, '0.eml');
      await fs.writeFile(destPath, message);
    });
  }

  // Start the email parsing and composing process
  async start(instanceID: string, orgPath: string) {
    try {
      if (!fs.existsSync(orgPath)) {
        this.logger.error('EmailParserService/start:', orgPath);
        return;
      }
      // make dir
      const destDir = orgPath.replace(/\.[^/.]+$/, '');
      await fs.mkdir(destDir, { recursive: true });

      // parse & compose email
      const parsedEmail = await this.parseEmail(orgPath, destDir);
      await this.composeEmailWithoutAttachment(destDir, parsedEmail);

      // emit event
      this.eventEmitter.emit(`email.parsed.${instanceID}`, destDir);
    } catch (e) {
      this.logger.error('EmailParserService/start:', orgPath, e.message);
    }
  }
}
