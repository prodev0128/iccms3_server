import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/jwt';

import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({ description: 'page number', name: 'page' })
  @ApiQuery({ description: 'pageSize', name: 'pageSize' })
  @ApiQuery({ description: 'filterModel', name: 'filterModel' })
  @ApiQuery({ description: 'sortModel', name: 'sortModel' })
  findUsers(
    @Query('page') page = 0,
    @Query('pageSize') pageSize = 10,
    @Query('filterModel') filterModel: string,
    @Query('sortModel') sortModel: string,
  ) {
    return this.usersService.findUsers(page, pageSize, filterModel, sortModel);
  }

  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.usersService.createUser(userDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    return this.usersService.updateUser(id, userDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Post('reset-password/:id')
  async resetPassword(@Param('id') id: string) {
    return this.usersService.resetPassword(id);
  }
}
