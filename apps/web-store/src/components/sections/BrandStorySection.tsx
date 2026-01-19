import { Sparkles, Leaf, Truck } from 'lucide-react';

interface BrandStorySectionProps {
  imageUrl: string;
}

const features = [
  {
    icon: Leaf,
    label: '100% Sustainable Materials',
  },
  {
    icon: Truck,
    label: 'Carbon Neutral Shipping',
  },
];

export function BrandStorySection({ imageUrl }: BrandStorySectionProps) {
  return (
    <section className="py-24 px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="relative">
        <div className="aspect-square bg-primary/10 rounded-xl overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        </div>
        <div className="absolute -bottom-8 -right-8 bg-white dark:bg-background-dark p-8 rounded-lg shadow-xl max-w-xs border border-gray-100 dark:border-gray-800">
          <Sparkles className="w-10 h-10 text-primary mb-4" />
          <p className="text-sm font-medium italic">
            &quot;Quality is not an act, it is a habit. Our pieces are crafted
            to outlast seasons.&quot;
          </p>
        </div>
      </div>
      <div>
        <span className="text-accent-rose font-bold text-xs uppercase tracking-widest block mb-4">
          The Journal
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Crafting the Future of Conscious Luxury
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-light text-lg">
          Each garment in our Winter collection is the result of painstaking
          research into sustainable fibers and timeless design. We believe in
          fashion that tells a story, curated for the modern individual who
          values substance as much as style.
        </p>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
