import { forwardRef, Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { UsersModule } from 'src/users/users.module';
import { OrderController } from './order.controller';
import { OrderService } from './services';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
