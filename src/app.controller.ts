import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  LocalAuthGuard,
  AuthService,
  JwtAuthGuard,
  BasicAuthGuard,
} from './auth';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

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
    console.log('req: ', req);
    console.log('req.user: ', req.body.user);
    const token = this.authService.login(req.body.user, 'basic');
    console.log('token: ', token);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        ...token,
      },
    };
  }

  // @UseGuards(BasicAuthGuard)
  @Get('api/profile')
  async getProfile(@Request() req) {
    console.log('req: ', req);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user: req.body.user,
      },
    };
  }
}
