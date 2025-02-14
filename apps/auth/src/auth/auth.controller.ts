import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ description: 'Login', type: LoginDto })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiBody({ description: 'Register', type: RegisterDto })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
