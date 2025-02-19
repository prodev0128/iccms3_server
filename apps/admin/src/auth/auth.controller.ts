import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';
import { User } from '@app/user';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async fetchUser(@User() user: any) {
    return this.authService.fetchUser(user);
  }
}
