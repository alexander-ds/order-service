import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';

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
          this.httpService.post('http://localhost:3001/products/validate', {
            id: item.productId,
            quantity: item.quantity,
          }),
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
        status: OrderStatus.PENDING,
        total,
        items,
      });

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException('Error creando la orden');
    }
  }

  async findAllByUser(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  async updateStatus(id: string, newStatus: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.SHIPPED],
      [OrderStatus.SHIPPED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    const allowed = validTransitions[order.status];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `No se puede cambiar de ${order.status} a ${newStatus}`,
      );
    }

    if (newStatus === OrderStatus.SHIPPED) {
      try {
        for (const item of order.items) {
          await firstValueFrom(
            this.httpService.post(
              'http://localhost:3001/products/decrease-stock',
              {
                id: item.productId,
                quantity: item.quantity,
              },
            ),
          );
        }
      } catch (error) {
        throw new BadRequestException(
          'Error descontando stock en productos',
        );
      }
    }

    order.status = newStatus;

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error actualizando el estado de la orden',
      );
    }
  }
}
