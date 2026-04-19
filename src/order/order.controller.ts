/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una orden' })
  @ApiResponse({ status: 201, description: 'Orden creada correctamente' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud' })
  @ApiBody({ type: CreateOrderDto })
  create(@Body() dto: CreateOrderDto) {
    const userId = 'mock-user'; // luego viene del JWT
    return this.service.create(dto, userId);
  }
}