import {
  HeroSection,
  CategoryGridSection,
  BrandStorySection,
  NewsletterSection,
} from '@/components/sections';
import { NewArrivalsWithCart } from '@/components/sections/NewArrivalsWithCart';
import { getProducts } from '@/lib/products';

interface ProductView {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  isNew: boolean;
}

// Static Category data
const categories = [
  {
    title: 'Women',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANkE7maysRIxmYerYzMulWh-xxuE4-vQq7iOP8BLAsp7qsRUy2tygBltzPKrYsFFSP5ROHsD0R56ILKgQ30pQ0Vtv3Fg8ctJF15uT_Fy3KtkVVN_BYnzUOkMHPyRe692n_iBXHI95MaHUkZV7-1BuJHt4x-uLIyH763wi1jyTq0IDUIj2jYtEFRvqV-sT1vqYlOPmn8WblMUdAaqa1MRvB1bD83oXc7ECIKWMyLWw2c8Vh2zgRECwqKvH6zbZLX59fKO7wiATvNnY',
    imageAlt: 'Woman wearing high-end fashion tailoring',
    href: '/women',
  },
  {
    title: 'Men',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAfEra4lR8ygtC2RRWrTvyD9gRJC0P7S4XKls3W-ytrZZh3E1mkirGWCEe3iwgQJWa54xO5wui7MgGFazUP18e0A6QWkAksZ-qY758EgN1W9FA_CuokrvNBLrSHBHXNqrmhuRvRWJI-84QBVock8AG56zls3T6R8C2ThB9ZzDIEcJs64NQpKbQ_YPa1Di2P0kslFPzfapdZtBWGm1CxsSoc3cCuOyOj1XTylQqH10XBr61hGKzJa-7F0M-YmAdmtXU51uA3BMTe-sk',
    imageAlt: 'Man in minimalist essentials outfit',
    href: '/men',
  },
  {
    title: 'Accessories',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxz-03WyWvU12CMzjA3xDiu33-nIvC5Mam7EQevfms7zOKtIsiAd5ew2IOXl-ltlyFs2dvLCWh60J1gdb2k8wxQppyiFV057XRIQydUN280khH6PQTGTKJpFkNqCNq5RkBL5foRs0zvOiDGgeTsWpYVAHWpuiUcsPpur1ztLg-U-kKUn3PZM7V3DmDtWktTXCEsfyMb1n4ykeS5viE2FREqCcehSwsFgFaoPqQKoKv-fv0o6X3bP5ENtVj66h3jPq-omnKwINRnwg',
    imageAlt: 'Close up of luxury leather goods and jewelry',
    href: '/accessories',
  },
];

export default async function HomePage() {
  let products: ProductView[] = [];
  
  try {
    const data = await getProducts(1, 5);
    if (data && data.products) {
      products = data.products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.base_price || p.basePrice || 0,
        imageUrl: p.image_urls?.[0] || 'https://via.placeholder.com/400',
        imageAlt: p.name,
        isNew: true // logic could be based on created_at
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products for homepage:', error);
    // Fallback could be handled here or just show empty
  }

  return (
    <>
      <HeroSection
        subtitle="Winter 2024 Collection"
        title="Timeless Silhouettes"
        backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBw-GqPwlSP6njTlbjiKT1I_LoOuW8c4oVgnq36GWBnjqoqzkiY1OYVPjtGEd1f6jRW3DknSash4RRFmnMxvB0GKHhrShjQ0lgGg2BSU9qfmOUZYUrvAqTs0WMOZj_I1pOUfFZHenFyONiRTdXm0BgAfQa0560D6W5_NT2tCa7NZeTsBGwPGwoLrtLSk_BT1Anrq-hufOk9RPaP6Dnf86deIfQlD35mwElcp_T7MgZ63li25GtevFlEPdi8gWiqlRdbDXmuWiq7cGM"
        primaryCta={{ label: 'Explore Collection', href: '/collections/winter-2024' }}
        secondaryCta={{ label: 'View Film', href: '/editorial/winter-2024' }}
      />

      <NewArrivalsWithCart products={products} />

      <CategoryGridSection categories={categories} />

      <BrandStorySection
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8zRr5FGL9trtEIHGXhXwOceR_IfD3wrFlYKzErjv24y4P-XMcBB4d0ZNL7beXi5jGfVk22HBjJ_UAGmiRb3gSXAuUoO3qRspTPyRXW50Nl80xGe1BbjK_6X50uW63YUeRAevrYhAARKwUChe5IG4nA9Xo7_vif1-fF7uMwoS0UgN5NgvSmv1hjWJBdTBxVe05gD7n2DcMZ-Vktm6_TO7FstdYpzjE8YljRArAn3uyapxI_wIHhVSLC6wZ71XMvFOl5hHsI74KHw"
      />

      <NewsletterSection />
    </>
  );
}
