import type { DynamicModule } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { FileLogger } from './logger.provider';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(appName: string): DynamicModule {
    const logger = new FileLogger(appName, appName); // Create a logger with the app name
    return {
      exports: ['GLOBAL_LOGGER'],
      module: LoggerModule,
      providers: [
        {
          provide: 'GLOBAL_LOGGER',
          useValue: logger, // Share the logger globally
        },
      ], // Export the logger
    };
  }
}
