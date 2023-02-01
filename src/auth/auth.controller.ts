import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/dtos/user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(User)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('authUser')
  @UseGuards(AuthGuard)
  authUser(@CurrentUser() user: any) {
    return user;
  }

  @Post('signup')
  async signup(@Body() body: AuthDto, @Session() session: any) {
    const user = await this.authService.signup(body);
    session.userID = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: AuthDto, @Session() session: any) {
    const user = await this.authService.signin(body);
    session.userID = user.id;
    return user;
  }
}
