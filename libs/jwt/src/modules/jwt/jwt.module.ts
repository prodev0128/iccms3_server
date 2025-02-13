import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from '@app/config';
import { JwtStrategy } from '@app/jwt/modules/jwt/jwt.strategy';

@Module({
  exports: [NestJwtModule],
  imports: [
    PassportModule,
    NestJwtModule.register({
      secret: config.jwt.secret,
      signOptions: {
        expiresIn: config.jwt.expiresIn,
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class JwtModule {}
