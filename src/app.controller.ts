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
    const token = this.authService.login(req.body.user, 'basic');
    console.log('token: ', token);
    const user = await this.userService.createOne(req.body.user);
    console.log('user: ', user);
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
    const user = this.userService.findOne(req.body.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        user,
      },
    };
  }
}
