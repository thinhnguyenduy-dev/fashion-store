'use client';

import { ProductCard, ProductCardProps } from '../ui/ProductCard';
import { useCart } from '@/lib/cart';

interface ShopProductGridProps {
  products: any[];
}

export function ShopProductGrid({ products }: ShopProductGridProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = (id: string) => {
      const product = products.find(p => p.id === id);
      if (product) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
        <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            imageAlt={product.imageAlt}
            isNew={product.isNew}
            onAddToCart={handleAddToCart}
        />
        ))}
    </div>
  );
}
