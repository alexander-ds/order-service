import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    example: [
      {
        productId: 'uuid-producto',
        quantity: 2,
      },
    ],
  })
  items: {
    productId: string;
    quantity: number;
  }[];
}