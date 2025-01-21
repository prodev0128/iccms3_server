import { Module, DynamicModule, Global } from '@nestjs/common';

import { FileLogger } from './logger.provider';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(appName: string): DynamicModule {
    const logger = new FileLogger(appName, appName); // Create a logger with the app name
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'GLOBAL_LOGGER',
          useValue: logger, // Share the logger globally
        },
      ],
      exports: ['GLOBAL_LOGGER'], // Export the logger
    };
  }
}
