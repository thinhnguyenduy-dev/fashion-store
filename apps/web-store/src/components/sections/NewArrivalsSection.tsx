import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard, ProductCardProps } from '../ui/ProductCard';

interface NewArrivalsSectionProps {
  products: Omit<ProductCardProps, 'onAddToCart'>[];
  onAddToCart?: (id: string) => void;
}

export function NewArrivalsSection({
  products,
  onAddToCart,
}: NewArrivalsSectionProps) {
  return (
    <section className="py-20">
      <div className="px-6 lg:px-20 mb-10 flex justify-between items-end">
        <div>
          <span className="text-accent-rose font-bold text-xs uppercase tracking-widest block mb-2">
            Curated selection
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            New Arrivals
          </h2>
        </div>
        <Link
          href="/shop"
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b border-primary pb-1"
        >
          Shop All
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="no-scrollbar overflow-x-auto px-6 lg:px-20">
        <div className="flex gap-8 pb-8 min-w-max">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
