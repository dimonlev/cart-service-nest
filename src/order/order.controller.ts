import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  Inject,
  forwardRef,
  HttpStatus,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { AppRequest } from '../shared';
import { OrderService } from './services';

@Controller('api/profile/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserOrder(@Req() req: AppRequest) {
    console.log('findUserOrder(req): ', req);
    const data = await this.orderService.getById();
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data,
    };
  }

  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserOrder(@Req() req: AppRequest, @Body() body) {
    // TODO: validate body payload...
    console.log('updateUserOrder req: ', req);
    console.log('updateUserOrder body: ', body);
  }
}
