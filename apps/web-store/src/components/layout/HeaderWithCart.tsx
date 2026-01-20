'use client';

import { useCart } from '@/lib/cart';
import { Header } from './Header';
import Link from 'next/link';

export function HeaderWithCart() {
  const { itemCount } = useCart();

  // Override the cart button to link to checkout
  return (
    <Header cartItemCount={itemCount} />
  );
}
