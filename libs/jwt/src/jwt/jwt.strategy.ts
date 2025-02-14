import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@app/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract token from Bearer Authorization header
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Reject expired tokens
      secretOrKey: config.jwt.secret, // Use environment variable for production
    });
  }

  async validate(payload: any) {
    // Payload is the decoded JWT
    return {
      name: payload.name,
      roles: payload.roles,
      userID: payload.userID,
    };
  }
}
