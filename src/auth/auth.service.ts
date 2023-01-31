import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup({ email, password }: { email: string; password: string }) {
    // Check if email already exist
    const users = await this.userService.find(email);

    // if Yes throw an error
    if (users.length) throw new BadRequestException('Email already exist');

    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hashPassword = (await scrypt(password, salt, 32)) as Buffer;
    const newPassword = salt + '.' + hashPassword.toString('hex');

    // Create new user
    const newUser = await this.userService.create({
      email,
      password: newPassword,
    });

    // Return user
    return newUser;
  }

  async signin({ email, password }: { email: string; password: string }) {
    // Check if user exist
    const [user] = await this.userService.find(email);

    if (!user) throw new NotFoundException('User not found');

    // Get salt and password from existing user
    const [salt, hashPassword] = user.password.split('.');

    // Hash the incoming password with the salt and compare the result
    const tempHashPassword = (await scrypt(password, salt, 32)) as Buffer;

    if (hashPassword !== tempHashPassword.toString('hex'))
      throw new UnauthorizedException('Password incorrect');

    // return user
    return user;
  }
}
