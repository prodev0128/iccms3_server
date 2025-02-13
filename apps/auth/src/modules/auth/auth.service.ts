import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import type { Model } from 'mongoose';

import type { UserDocument } from '@app/database';
import { User } from '@app/database';

import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const { password, userID } = body;
    const user = await this.userModel.findOne({ userID });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = {
      name: user.name,
      roles: user.roles,
      userID: user.userID,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(body: RegisterDto) {
    const { password, userID } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      password: hashedPassword,
      userID,
    });
    return await user.save();
  }
}
