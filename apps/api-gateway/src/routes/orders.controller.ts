import { Controller, Post, Body, Inject, OnModuleInit, UseGuards, Req } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GRPC_SERVICES } from '@fashion-store/proto';
import { Observable } from 'rxjs';

// Simplified Guard for demo - assumes Gateway checks auth potentially, or we just trust for now
// In real app, we extract userId from token in Gateway middleware.

interface OrderService {
  create(data: any): Observable<any>;
}

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private orderService: OrderService;

  constructor(
    @Inject(GRPC_SERVICES.ORDER_SERVICE) private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.orderService = this.client.getService<OrderService>(GRPC_SERVICES.ORDER_SERVICE);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    // Mock user ID from request (in real app, from JWT)
    // For demo, we might need to send it in body or hardcode if no auth middleware
    const userId = body.userId || 'test-user-id'; 

    return this.orderService.create({
      user_id: userId,
      items: body.items?.map((item: any) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.productName,
        sku: item.sku,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
      shipping_address: {
         street: body.shippingAddress.street,
         city: body.shippingAddress.city,
         state: body.shippingAddress.state,
         postal_code: body.shippingAddress.postalCode, 
         country: body.shippingAddress.country,
         first_name: body.shippingAddress.firstName,
         last_name: body.shippingAddress.lastName,
         phone: body.shippingAddress.phone
      },
      shipping_cost: 0, 
      discount: 0,
      notes: ''
    });
  }
}
