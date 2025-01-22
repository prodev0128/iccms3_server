import { DynamicModule, Module } from '@nestjs/common';

import { EmailParserService } from './email-parser.service';

@Module({})
export class EmailParserModule {
  static forRoot(filePath: string): DynamicModule {
    return {
      module: EmailParserModule,
      imports: [],
      providers: [
        {
          provide: 'FILE_PATH',
          useValue: filePath, // The connection string will be passed dynamically
        },
        EmailParserService,
      ],
      exports: [EmailParserService],
    };
  }
}
