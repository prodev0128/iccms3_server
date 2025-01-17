import { ConfigModule } from '@app/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NestMongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'), // Get MongoDB URI from ConfigModule
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [NestMongooseModule], // Export MongooseModule for use in other apps
})
export class MongooseModule {}
