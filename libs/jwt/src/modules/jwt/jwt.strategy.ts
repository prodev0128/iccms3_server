import { config } from '@app/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: config.jwt.secret, // Use environment variable for production
    });
  }

  async validate(payload: any) {
    // Payload is the decoded JWT
    return {
      userID: payload.userID,
      name: payload.name,
      permissions: payload.permissions,
    };
  }
}
