import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User, UserDocument } from '@app/database';
import { config } from '@app/globals/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      ignoreExpiration: true, // never expires
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Reject expired tokens
      secretOrKey: config.jwt.secret, // Use environment variable for production
    });
  }

  async validate(payload: any) {
    const { userID } = payload;
    const user = await this.userModel.findOne({ userID }).exec();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
