import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    const newUser = this.userService.create(body);
    return newUser;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
