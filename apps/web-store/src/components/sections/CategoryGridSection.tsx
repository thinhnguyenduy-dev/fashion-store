import { CategoryCard, CategoryCardProps } from '../ui/CategoryCard';

interface CategoryGridSectionProps {
  categories: CategoryCardProps[];
}

export function CategoryGridSection({ categories }: CategoryGridSectionProps) {
  return (
    <section className="px-6 lg:px-20 py-20 bg-white">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Shop by Category
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto font-light">
          Explore our curated departments, from modern tailoring to handcrafted
          accessories.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}
