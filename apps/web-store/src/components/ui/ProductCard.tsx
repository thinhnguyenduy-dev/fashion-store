'use client';

import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  imageAlt,
  isNew = false,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(id);
  };

  return (
    <div className="w-72 flex flex-col group cursor-pointer relative">
      <Link href={`/product/${id}`} className="absolute inset-0 z-0" aria-label={`View details for ${name}`} />
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#efefef] mb-4 shadow-sm z-10 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-label={imageAlt}
        />
        {isNew && (
          <span className="absolute top-4 left-4 bg-accent-rose text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
            New
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white pointer-events-auto cursor-pointer"
          aria-label={`Add ${name} to cart`}
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
        </button>
      </div>
      <div className="z-10 pointer-events-none">
        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
          {name}
        </h3>
        <p className="text-sm text-gray-500 font-light">
          ${(price || 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
