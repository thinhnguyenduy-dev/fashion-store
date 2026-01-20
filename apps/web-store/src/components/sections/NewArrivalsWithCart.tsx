'use client';

import { useCart } from '@/lib/cart';
import { NewArrivalsSection } from '@/components/sections/NewArrivalsSection';

interface ProductViewForCart {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  isNew?: boolean;
  base_price?: number;
  image_urls?: string[];
}

interface NewArrivalsWithCartProps {
  products: ProductViewForCart[];
}

export function NewArrivalsWithCart({ products }: NewArrivalsWithCartProps) {
  const { addItem } = useCart();

  const handleAddToCart = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      // Construct a minimal product object for cart
      addItem({
        id: product.id,
        name: product.name,
        description: '',
        base_price: product.price || product.base_price || 0,
        image_urls: product.imageUrl ? [product.imageUrl] : product.image_urls || [],
        category_id: '',
      }, 1);
    }
  };

  return (
    <NewArrivalsSection 
      products={products} 
      onAddToCart={handleAddToCart} 
    />
  );
}
