
import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: 'The Art of Slow Fashion',
    category: 'Sustainability',
    date: 'October 12, 2024',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
    summary: 'Why investing in quality over quantity is the future of your wardrobe.'
  },
  {
    id: 2,
    title: 'Minimalism Redefined',
    category: 'Style Guide',
    date: 'September 28, 2024',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
    summary: 'Exploring the nuances of modern minimalist design in a maximalist world.'
  },
  {
    id: 3,
    title: 'Behind the Seams',
    category: 'Craftsmanship',
    date: 'September 15, 2024',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200',
    summary: 'A look into the atelier where our signature pieces come to life.'
  },
  {
    id: 4,
    title: 'Color Psychology',
    category: 'Trends',
    date: 'August 30, 2024',
    image: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1200',
    summary: 'How the colors you wear influence your mood and perception.'
  },
];

export default function EditorialPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#131516] dark:text-white font-display pb-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <header className="mb-20 text-center border-b border-gray-200 dark:border-gray-800 pb-12">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-6">The Editorial</h1>
            <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto">
                Stories on design, culture, and the art of living well.
            </p>
        </header>

        {/* Featured Article */}
        <section className="mb-24">
            <Link href="#" className="group block grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${articles[0].image}')` }}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-primary mb-4">
                        <span>{articles[0].category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-gray-400">{articles[0].date}</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black tracking-custom mb-6 group-hover:text-primary transition-colors leading-tight">
                        {articles[0].title}
                    </h2>
                    <p className="text-gray-500 text-lg font-light leading-relaxed mb-8 max-w-md">
                        {articles[0].summary}
                    </p>
                    <span className="text-xs font-bold uppercase tracking-widest underline underline-offset-4 decoration-gray-300 hover:decoration-primary">Read Story</span>
                </div>
            </Link>
        </section>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {articles.slice(1).map((article) => (
            <Link key={article.id} href="#" className="group block flex flex-col h-full">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-6 bg-gray-100">
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${article.image}')` }}
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
                    <span>{article.category}</span>
                    <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                    <span className="text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-6">
                    {article.summary}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors">Read More</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
