import { Body, Controller, Post, Session } from '@nestjs/common';
import { AuthDto } from './dtos/auth.dto';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../users/dtos/user.dto';

@Controller('auth')
@Serialize(User)
export class AuthController {
  constructor(private authService: AuthService) {}

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
