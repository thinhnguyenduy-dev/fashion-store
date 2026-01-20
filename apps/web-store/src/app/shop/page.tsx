import { ShopProductGrid } from '@/components/sections/ShopProductGrid';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  let products: any[] = [];
  
  try {
    const data = await getProducts(1, 100);
    if (data && data.products) {
      products = data.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.base_price || p.basePrice || 0,
        imageUrl: p.image_urls?.[0] || 'https://via.placeholder.com/400',
        imageAlt: p.name,
        isNew: true // Placeholder logic
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products for shop page:', error);
  }

  return (
    <div className="pt-24 px-6 lg:px-20 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Shop All</h1>
        <p className="text-gray-500 max-w-2xl">
          Explore our complete collection of timeless silhouettes and luxury essentials.
        </p>
      </div>
      
      <ShopProductGrid products={products} />
    </div>
  );
}
