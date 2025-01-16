import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
      load: [
        () => ({
          port: {
            api: parseInt(process.env.PORT_APP_API, 10) || 3128,
            auth: parseInt(process.env.PORT_APP_AUTH, 10) || 3129,
          },
          mongodb: {
            uri:
              process.env.MONGODB_URI ||
              'mongodb://admin:qjsslftys128@0.0.0.0:27017/iccms3',
          },
          jwt: {
            secret: process.env.JWT_SECRET || 'secret',
            expiresIn: process.env.EXPIRESIN || '1h',
          },
        }),
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService], // Export ConfigService to be used in other modules
})
export class ConfigMyModule {}
