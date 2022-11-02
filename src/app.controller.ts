import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthService, BasicAuthGuard } from './auth';
import { UsersService } from './users';
@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get(['', 'ping'])
  healthCheck(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  // @UseGuards(LocalAuthGuard)
  @Post('api/auth/login')
  async login(@Request() req) {
    const token = await this.authService.login(req.body.user, 'basic');
    console.log('login token: ', token);
    const user = await this.userService.createOne(req.body.user);
    console.log('login user: ', user);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...token,
        user,
      },
    };
  }

  @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    console.log('getProfile req: ', req);
    console.log('getProfile req.user: ', req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.user,
      },
    };
  }
}
