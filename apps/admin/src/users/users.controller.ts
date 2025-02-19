import { Body, Controller, Delete, Get, Param, Patch, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.update(id, userDto);
  }

  @Patch(':id')
  updatePartial(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.updatePartial(id, userDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
