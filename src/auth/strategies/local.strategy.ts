import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';
import { User } from 'src/users';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: User): Promise<any> {
    const user = await this.authService.validateUser(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
