
import Link from 'next/link';

const collections = [
  {
    id: 'summer-edit',
    title: 'The Summer Edit',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000',
    description: 'Breathable fabrics and relaxed silhouettes for the warmer days.'
  },
  {
    id: 'formal-wear',
    title: 'Modern Formal',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c47e356?auto=format&fit=crop&q=80&w=1000',
    description: 'Sharp tailoring meets contemporary comfort.'
  },
  {
    id: 'accessories',
    title: 'Essential Accessories',
    image: 'https://images.unsplash.com/photo-1509319117193-42d427418599?auto=format&fit=crop&q=80&w=1000',
    description: 'The finishing touches that define your style.'
  },
  {
    id: 'work-from-anywhere',
    title: 'Work From Anywhere',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1000',
    description: 'Versatile pieces for the hybrid professional.'
  },
  {
    id: 'weekend-getaway',
    title: 'Weekend Getaway',
    image: 'https://images.unsplash.com/photo-1507680436348-1dc881f630e6?auto=format&fit=crop&q=80&w=1000',
    description: 'Effortless style for your off-duty adventures.'
  },
  {
    id: 'sustainable-basics',
    title: 'Sustainable Basics',
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=1000',
    description: 'Eco-conscious essentials for everyday wear.'
  }
];

export default function CollectionsPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#131516] dark:text-white font-display pb-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <header className="mb-16 text-center">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter mb-4">Curated Collections</h1>
            <p className="text-gray-500 text-lg font-light max-w-2xl mx-auto">
                Explore our thoughtfully assembled selections, designed to inspire your next look.
            </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/shop?collection=${collection.id}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-6">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${collection.image}')` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">
                {collection.title}
              </h2>
              <p className="text-gray-500 font-light text-sm">
                {collection.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
