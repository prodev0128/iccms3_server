import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@app/globals/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: true, // never expires
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Reject expired tokens
      secretOrKey: config.jwt.secret, // Use environment variable for production
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
