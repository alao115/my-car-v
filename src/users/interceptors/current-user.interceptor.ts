import {
  NestInterceptor,
  Injectable,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const requset = context.switchToHttp().getRequest();
    const { userID } = requset.session;

    if (userID) {
      const user = await this.userService.find(userID);
      requset.currentUser = user;
    }

    return next.handle();
  }
}
