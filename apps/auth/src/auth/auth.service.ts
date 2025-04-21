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

  async login(loginDto: LoginDto) {
    const { password, userID } = loginDto;
    const user = await this.userModel.findOne({ userID });
    console.log('user', await bcrypt.hash(password, 10));
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Un Allowed User');
    }
    const payload = JSON.parse(JSON.stringify(user));
    return { accessToken: this.jwtService.sign(payload) };
  }

  async register(registerDto: RegisterDto) {
    const { name, password, userID } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      password: hashedPassword,
      userID,
    });
    return await user.save();
  }

  async fetchProfile({ userID }) {
    return this.userModel.findOne({ userID });
  }
}
