import { config } from '@app/config';
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    NestJwtModule.register({
      secret: config.jwt.secret,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
