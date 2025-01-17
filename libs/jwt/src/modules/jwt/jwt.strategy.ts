import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer Authorization header
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: configService.get<string>('jwt.secret'), // Use environment variable for production
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
