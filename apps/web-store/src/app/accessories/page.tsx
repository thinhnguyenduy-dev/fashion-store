
import { getProducts } from '@/lib/products';
import { ShopProductGrid } from '@/components/sections/ShopProductGrid';

export const dynamic = 'force-dynamic';

export default async function AccessoriesPage() {
  let products = [];
  try {
    const data = await getProducts(1, 100, ['Accessories']);
    products = data.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.base_price || p.basePrice || 0,
        imageUrl: p.image_urls?.[0] || 'https://via.placeholder.com/400',
        imageAlt: p.name,
        isNew: true
    }));
  } catch (error) {
    console.error('Failed to fetch accessories:', error);
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#131516] dark:text-white font-display pb-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <header className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">Accessories</h1>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
        </header>
        <ShopProductGrid products={products} />
      </div>
    </div>
  );
}
