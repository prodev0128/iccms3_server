import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigMyModule } from 'libs/config/src';
import { DatabaseModule } from 'libs/database/src';

@Module({
  imports: [
    ConfigMyModule, // Import ConfigModule to access configurations
    MongooseModule.forRootAsync({
      imports: [ConfigMyModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'), // Get MongoDB URI from ConfigModule
      }),
      inject: [ConfigService],
    }),
    DatabaseModule, // Import DatabaseModule for shared schemas
  ],
  providers: [],
})
export class AppModule {}
