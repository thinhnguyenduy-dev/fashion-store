import {
  HeroSection,
  NewArrivalsSection,
  CategoryGridSection,
  BrandStorySection,
  NewsletterSection,
} from '@/components/sections';

// Product data
const products = [
  {
    id: '1',
    name: 'Structured Wool Overcoat',
    price: 850.0,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOyHPwuCHJjnxV8UbVwsRv-SLjcmZz3QrfvWEj9pl-7uLhRxzzkVtEAVXgA4fEicF2utATRjCmL8jHUsOkKONd_2mMmjd2nzTp15ruHEwqFVXUuJ2N7gcLrP--vj7Kjn2PxApnPDJcYVQykbkjTTGUIZ_A6cr_8kGXlDjre0pMK2WFPF1IjPxHyph838oIolE1WAvQWTewxGczN_ra1nYxrHNMT7w-y9vOenHPjmmtBn4kC2naHtewEYJsWfEJUQGTbP0xjmsw5oo',
    imageAlt: 'Minimalist wool overcoat in charcoal grey',
    isNew: true,
  },
  {
    id: '2',
    name: 'Silk Luminary Slip Dress',
    price: 420.0,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPPgyg1udPacz6TvOAJnqhhuQxy2V5orVR1WXSh2O3VWhkN6Mdb_tQ5Je00-qkWi7nsMzoP6aB4eppUWh-4OpKnWmnsQnLgPwdboXEvCRXAieR78XFQDPzDfnHmsTT_7wdChYv38tKIKOg3RywIGROlDZBzszevXuOGECYUL36SghfWW7wB2gzgqJrMZqC_BiaNFURIfOODDvJDSYEXhVUYkI5K4iVC1EV3yxBGg1g5dgr1Uo5eK2cpsNV6AYcAcQvygfsoeyC7UU',
    imageAlt: 'Premium silk slip dress in cream color',
    isNew: false,
  },
  {
    id: '3',
    name: 'Artisan Cashmere Knit',
    price: 350.0,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcbW6ZGHguh-Apz15ZYxMNMl67rkIo3FbyU6JPUSq63SgRHeffrCuvKup2QUdmUWrj7JOsh7zrj-aQ75eKCk5Gs-eKBPphBuh3Tk4BeoOIj5mhQi3GyeEOyZGC22BuTvUFfzsZrgHrej5IAH7DXWw1lWmAxaq6VKLDNSAiUJjAwrkzmPTsuHtPLWQlU1Amk8x7jY8mpDUXTeulJGGhqL5jXlYV9aNQEmrKRTwtt_rAcJpXTtJEzzzCvWjPogNGkGKoTi1d7R0hXtM',
    imageAlt: 'Soft cashmere knit sweater in sand tone',
    isNew: false,
  },
  {
    id: '4',
    name: 'Sculpted Leather Boots',
    price: 580.0,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBM7hA35JlMKCPVFsEq6kybwF9FZEH56lHu5UuKfgMBgGSC0zQJTqxqwdT_sKMn8OjZKncQ4SPmSZr1nbjSM7fJP7aCl_YrKNypCUiU_yPW50Q2gbvB_apcksa8o-f9ZjJVbkaOcE_im34nct8JzYXN5dWrsYPPJ8eIMjLZx-oprsCWkSasJ9pGu6GIllIRzBZ7CKXVZbiJFrxF6CkgC0b6kFo_5YATlfN5n9lIBOjhszYY5F40OU71zpB3kMpcWvnD913ChDX7SG8',
    imageAlt: 'Handcrafted luxury leather Chelsea boots',
    isNew: false,
  },
  {
    id: '5',
    name: 'Frame Leather Clutch',
    price: 310.0,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl6nKdzp3j2tvg6lPUV960Yea_8_Wxq5r1A-C2KrwjJuj3qWDzK3EBWNwATETdiO1ZH3HoS121QGxgSbGJLyccyLpblK3l9y0hOumfcnteXDnCThsGEPl2tzQBYUhrLZQUtM0TsZkFDK65ErGn7wd0BPtPkDAtitip9fNu3Yu8-wCUlihM_51S_ioYxp-hJi4kAiB0IeNnShsb4RvpSiTL7to5pDsVn_jayZqSUv3Vst9boN0qV-osrMMAGFzwzsePK3YkhWudJIE',
    imageAlt: 'Architectural clutch bag in black leather',
    isNew: false,
  },
];

// Category data
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

export default function HomePage() {
  return (
    <>
      <HeroSection
        subtitle="Winter 2024 Collection"
        title="Timeless Silhouettes"
        backgroundImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBw-GqPwlSP6njTlbjiKT1I_LoOuW8c4oVgnq36GWBnjqoqzkiY1OYVPjtGEd1f6jRW3DknSash4RRFmnMxvB0GKHhrShjQ0lgGg2BSU9qfmOUZYUrvAqTs0WMOZj_I1pOUfFZHenFyONiRTdXm0BgAfQa0560D6W5_NT2tCa7NZeTsBGwPGwoLrtLSk_BT1Anrq-hufOk9RPaP6Dnf86deIfQlD35mwElcp_T7MgZ63li25GtevFlEPdi8gWiqlRdbDXmuWiq7cGM"
        primaryCta={{ label: 'Explore Collection', href: '/collections/winter-2024' }}
        secondaryCta={{ label: 'View Film', href: '/editorial/winter-2024' }}
      />

      <NewArrivalsSection products={products} />

      <CategoryGridSection categories={categories} />

      <BrandStorySection
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ8zRr5FGL9trtEIHGXhXwOceR_IfD3wrFlYKzErjv24y4P-XMcBB4d0ZNL7beXi5jGfVk22HBjJ_UAGmiRb3gSXAuUoO3qRspTPyRXW50Nl80xGe1BbjK_6X50uW63YUeRAevrYhAARKwUChe5IG4nA9Xo7_vif1-fF7uMwoS0UgN5NgvSmv1hjWJBdTBxVe05gD7n2DcMZ-Vktm6_TO7FstdYpzjE8YljRArAn3uyapxI_wIHhVSLC6wZ71XMvFOl5hHsI74KHw"
      />

      <NewsletterSection />
    </>
  );
}
