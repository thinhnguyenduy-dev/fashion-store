import { fetchApi } from './api';
import { CartItem } from './cart';

export interface CreateOrderData {
  items: {
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    sku: string;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export async function createOrder(data: CreateOrderData) {
  return fetchApi('/orders', {
    method: 'POST',
    authenticated: true,
    body: JSON.stringify(data),
  });
}
