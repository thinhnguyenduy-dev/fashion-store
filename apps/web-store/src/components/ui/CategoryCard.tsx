import Link from 'next/link';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface CategoryCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
  className?: string;
}

export function CategoryCard({
  title,
  imageUrl,
  imageAlt,
  href,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'relative group h-[600px] overflow-hidden rounded-lg cursor-pointer block',
        className
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
        style={{ backgroundImage: `url("${imageUrl}")` }}
        aria-label={imageAlt}
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
      <div className="absolute bottom-10 left-10 text-white">
        <h3 className="text-2xl font-bold uppercase tracking-widest mb-4">
          {title}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="bg-white text-primary border-none hover:bg-primary hover:text-white uppercase tracking-tighter"
        >
          Shop Now
        </Button>
      </div>
    </Link>
  );
}
