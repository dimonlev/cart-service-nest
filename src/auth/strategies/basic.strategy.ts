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

  async validate(user: User): Promise<any> {
    const userValidated = this.authService.validateUser(user);
    console.log('user: ', user);
    if (!userValidated) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
    console.log('result: ', result);
    return result;
  }
}
