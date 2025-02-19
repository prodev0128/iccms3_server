import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { User, UserDocument } from '@app/database';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

  async fetchUser({ userID }) {
    return this.userModel.findOne({ userID }, { _id: 0, name: 1, roles: 1, userID: 1 });
  }
}
