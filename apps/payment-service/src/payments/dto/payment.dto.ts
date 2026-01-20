import { IsString, IsNumber, IsUUID, IsEnum, Min } from 'class-validator';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  TEST_PROVIDER = 'TEST_PROVIDER',
}

export class ProcessPaymentDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  currency?: string = 'USD';

  @IsEnum(PaymentProvider)
  provider?: PaymentProvider = PaymentProvider.TEST_PROVIDER;
}

export class RefundPaymentDto {
  @IsUUID()
  orderId: string;
  
  @IsString()
  paymentId: string;

  @IsString()
  reason?: string;
}
