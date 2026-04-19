import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]),HttpModule,],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}