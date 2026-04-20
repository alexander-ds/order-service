/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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
    const userId = 'mock-user';
    return this.service.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar órdenes del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes' })
  findAll() {
    const userId = 'mock-user';
    return this.service.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de la orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Transición inválida' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiBody({ type: UpdateOrderStatusDto })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.service.updateStatus(id, dto.status);
  }
}