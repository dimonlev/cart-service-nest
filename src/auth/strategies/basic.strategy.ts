import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { BasicStrategy as Strategy } from 'passport-http';
import { User } from 'src/users';

import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, pass: string) {
    const user = await this.authService.validateUser(username, pass);
    console.log('validate user: ', user);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
    console.log('validate result: ', result);
    console.log('validate user: ', user);
    return result;
  }
}
