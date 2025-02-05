import { Inject, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import { simpleParser } from 'mailparser';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class EmailParserService {
  constructor(@Inject('GLOBAL_LOGGER') private readonly logger: Logger) {}

  async parseEmail(srcPath: string, destDir: string) {
    try {
      const emailContent = await fs.readFile(srcPath);
      const parsed = await simpleParser(emailContent);

      // Save attachments
      const destPaths = [];
      for (const attachment of parsed.attachments) {
        const attachmentPath = path.join(destDir, attachment.filename);
        destPaths.push(attachmentPath);
        await fs.writeFile(attachmentPath, attachment.content);
        this.logger.log(`Attachment saved: ${attachmentPath}`);
      }
      this.logger.log(`Email successfully parsed from: ${srcPath}`);
      return { parsed, destPaths };
    } catch (error) {
      this.logger.error('EmailParseService/parseEmail:', error.message);
      throw error;
    }
  }

  async composeEmail(destDir: string, parsed: any) {
    const transporter = nodemailer.createTransport({
      streamTransport: true, // Only generates the email, does not send it
      newline: 'unix', // Use UNIX newlines for compatibility
      buffer: true, // Buffer the generated email
    });

    const emailOptions = { ...parsed };
    delete emailOptions.attachments;

    // To, From field
    Object.keys(emailOptions).forEach((key) => {
      if (emailOptions[key]?.text) {
        emailOptions[key] = emailOptions[key].text;
      }
    });

    // mail compose
    try {
      const emailInfo = await transporter.sendMail(emailOptions);
      const destPath = path.join(destDir, '0.eml');
      await fs.writeFile(destPath, emailInfo.message.toString());
      this.logger.log(`Email composed and saved to file: ${destPath}`);
      return destPath;
    } catch (error) {
      this.logger.error(`Failed to compose and save email to: ${destDir}. Reason: ${error.message}`);
    }
  }

  async start(instanceID: string, srcPath: string) {
    try {
      if (!fs.existsSync(srcPath)) {
        this.logger.warn(`Email parse skipped. File not found: ${srcPath}`);
        return;
      }

      // make dir
      const destDir = srcPath.replace(/\.[^/.]+$/, '');
      await fs.mkdir(destDir, { recursive: true });
      this.logger.log(`Output directory created: ${destDir}`);

      // parse & compose email
      const { parsed, destPaths } = await this.parseEmail(srcPath, destDir);
      if (destPaths.length) {
        const destPath = await this.composeEmail(destDir, parsed);
        destPaths.push(destPath);
        await fs.remove(srcPath);
      } else {
        destPaths.push(srcPath);
        await fs.remove(destDir);
      }
      this.logger.log(`Email processing completed for instance: ${instanceID}`);
      return destPaths;
    } catch (error) {
      this.logger.error(`Error during email processing for file: ${srcPath}. Reason: ${error.message}`);
    }
  }
}
