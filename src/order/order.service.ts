import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateOrderDto, userId: string) {
    try {
      let total = 0;
      const items: OrderItem[] = [];

      for (const item of dto.items) {
        const response = await firstValueFrom(
          this.httpService.post(
            'http://localhost:3001/products/validate',
            {
              id: item.productId,
              quantity: item.quantity,
            },
          ),
        );

        const product = response.data;

        const orderItem = this.orderItemRepository.create({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });

        total += product.price * item.quantity;
        items.push(orderItem);
      }

      const order = this.orderRepository.create({
        userId,
        status: 'PENDING',
        total,
        items,
      });

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException('Error creando la orden');
    }
  }
}