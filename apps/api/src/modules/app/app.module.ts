import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigEnvModule } from '@app/config';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    ConfigEnvModule, // Import ConfigModule to access configurations
    MongooseModule.forRootAsync({
      imports: [ConfigEnvModule],
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
