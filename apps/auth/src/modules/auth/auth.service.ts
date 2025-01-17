import { User, UserDocument } from '@app/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(body: LoginDto) {
    const { userID, password } = body;
    const user = await this.userModel.findOne({ userID });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = {
      userID: user.userID,
      name: user.name,
      permissions: user.permissions,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(body: RegisterDto) {
    const { userID, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      userID,
      password: hashedPassword,
    });
    return await user.save();
  }
}
