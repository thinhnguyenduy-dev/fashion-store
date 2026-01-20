
import { getProduct } from '@/lib/products';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let product = null;

  try {
    product = await getProduct(params.id);
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-primary hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Handle potentially missing fields or data structure differences
  const name = product.name;
  const description = product.description;
  const price = product.base_price || product.basePrice || 0;
  const images = product.image_urls || [];
  // Use first image or placeholder if no images
  const mainImage = images[0] || 'https://via.placeholder.com/600x800'; 
  // Mock additional images for the gallery if needed, or use real ones if available
  const galleryImages = images.slice(0, 4);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#131516] dark:text-white transition-colors duration-300 font-display">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-10 text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-[10px] text-xs">chevron_right</span>
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span className="material-symbols-outlined text-[10px] text-xs">chevron_right</span>
          <span className="text-[#131516] dark:text-white">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Product Gallery */}
          <div className="lg:col-span-7 flex gap-4">
            {/* Vertical Thumbnails (Hidden on mobile) */}
            <div className="hidden md:flex flex-col gap-3 w-20">
              {galleryImages.map((img: string, idx: number) => (
                <div key={idx} className="aspect-[3/4] rounded-lg overflow-hidden border border-transparent hover:border-gray-300 cursor-pointer group">
                  <div
                    className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${img}')` }}
                  />
                </div>
              ))}
              {/* Fallback mock thumbnails if only 1 image exists to match design feel */}
              {galleryImages.length < 2 && (
                 <>
                   <div className="aspect-[3/4] rounded-lg overflow-hidden border border-transparent hover:border-gray-300 cursor-pointer group">
                      <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${mainImage}')` }} />
                   </div>
                   <div className="aspect-[3/4] rounded-lg overflow-hidden border border-transparent hover:border-gray-300 cursor-pointer group">
                      <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${mainImage}')` }} />
                   </div>
                 </>
              )}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] rounded-xl overflow-hidden bg-white dark:bg-gray-900 group">
              <div
                className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${mainImage}')` }}
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-accent-rose text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full">New Arrival</span>
                )}
              </div>
            </div>
          </div>

          {/* Product Details Information */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <div className="mb-8">
                <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tighter leading-tight">{name}</h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl font-light text-primary">${price.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-10">
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 font-light">
                  {description || "Crafted from responsibly sourced materials, this piece reimagines classic tailoring with sharp, architectural lines. A statement of quiet luxury for the modern wardrobe."}
                </p>
              </div>

              {/* Color Swatches (Mocked for now as data structure might strictly support variants yet visually) */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest">Color: Midnight Charcoal</span>
                </div>
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full border-2 border-primary p-0.5 ring-2 ring-offset-2 ring-transparent">
                    <div className="w-full h-full rounded-full bg-[#1A1A1A]"></div>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 p-0.5 hover:border-gray-400 transition-colors">
                    <div className="w-full h-full rounded-full bg-[#E5E4E2]"></div>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 p-0.5 hover:border-gray-400 transition-colors">
                    <div className="w-full h-full rounded-full bg-[#3B2F2F]"></div>
                  </button>
                </div>
              </div>

              {/* Size Selector (Mocked) */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
                  <button className="text-[10px] font-bold underline underline-offset-4 uppercase tracking-widest text-gray-400 hover:text-primary">Size Guide</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <button className="py-3 border border-gray-200 dark:border-gray-700 rounded hover:border-primary transition-all text-sm font-medium">XS</button>
                  <button className="py-3 border-2 border-primary rounded text-sm font-bold bg-primary/5">S</button>
                  <button className="py-3 border border-gray-200 dark:border-gray-700 rounded hover:border-primary transition-all text-sm font-medium">M</button>
                  <button className="py-3 border border-gray-200 dark:border-gray-700 rounded hover:border-primary transition-all text-sm font-medium">L</button>
                  <button className="py-3 border border-gray-200 dark:border-gray-700 rounded opacity-50 cursor-not-allowed text-sm font-medium relative overflow-hidden">
                    XL
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[120%] h-px bg-gray-300 dark:bg-gray-600 -rotate-45"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-12">
                <button className="w-full bg-primary text-white py-5 rounded-lg font-bold tracking-[0.2em] uppercase hover:bg-opacity-90 transition-all shadow-xl shadow-primary/20">
                  Add to Bag
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 py-4 rounded-lg font-bold tracking-[0.2em] uppercase hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  Find in Store
                </button>
              </div>

              {/* Details Accordion */}
              <div className="border-t border-gray-200 dark:border-gray-800">
                <details className="group border-b border-gray-200 dark:border-gray-800 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-xs font-bold uppercase tracking-widest">Description & Fit</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    This blazer features a double-breasted closure, padded shoulders for structure, and signature curved seams that follow the silhouette. Fits true to size. Model is 5'10" and wears size S.
                  </div>
                </details>
                <details className="group border-b border-gray-200 dark:border-gray-800 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-xs font-bold uppercase tracking-widest">Composition & Care</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Main: 98% Virgin Wool, 2% Elastane. Lining: 100% Cupro. Professional dry clean only.
                  </div>
                </details>
                <details className="group border-b border-gray-200 dark:border-gray-800 py-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-xs font-bold uppercase tracking-widest">Shipping & Returns</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="pt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Free carbon-neutral shipping on all orders over $300. 30-day returns policy. Returns processed within 5-7 business days.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        {/* Style With Section */}
        <section className="mt-24 border-t border-gray-200 dark:border-gray-800 pt-16">
          <h3 className="text-2xl font-black mb-12 tracking-tight">Complete the Look</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA5BKkpHoNtWcGM_yFxGJjRwStwsaA2-wyzjI8Pl7jeRmS_4a6R-5-IOZEdnSP5nhHjgai-DERQMvlVtgpZ51ABcaoS0EwDJrAB_TVoyQfglhsBGUrIviWxI4vCRKaHvMgxGJnvZFl1sLBydjAEmw1VeUU8-VMQDPnVumQsPBp8T2Hm7WLNJebgVZWuBMUxdlOpQwu4eQZOTrDgOV5aQOsds5wG9zXPF55oQljOAqXVchIpj_sueaA3pKuWk2pFomhTlaepM6_zeQE')" }}></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1">Tailored Trousers</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">$290.00</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFOqemKyklDSPFzugGkEi8_LAt3uGuy_HMW_eHUazoXw08y7sCSVk0frDsYpF34G70FSpzKVDAtYIrlV0cQbHe7AKfo8XF2nY0qvu62oziU9UYaGmUmvnZYBOpMdL8H9BIorsbWJFPGx3zXc_2uXWsXwz1AIluegYjplwZdpG7eYUTmVU4b0edQiNIAJwm465PPtvJaeEA4jWFnHZkudwcAEKmSHwHsCMptvLJBxHWjvAcipTtwIygw3w2p8B-rmBP_SV8miThSm8')" }}></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1">Square-Toe Boot</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">$550.00</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkjIzV422_wEcGjZmt8LUnjpTQtDOKA7iKacIBH7qz2ObyASw97ZWh551apPlEZaH3JQXrlXhW0gGE7U8UVyg9WpJKOBVPeqv7vOX4jh-7FHwOpfBRIHQChKvLBJIWfrJ404RY5fyvC0b8mQw_jNUyNRnH4n4s9BbUamAaUdSTkb2jUb32vhwNeuCY6SQMlfY7HhiDsMvpGAx3y0dQYH-F6vAoR7ovFmzYBxziIAQYUGnj0LYlperd28xtMU5ggt_XURge6hTVWXc')" }}></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1">Structured Tote</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">$1,200.00</p>
            </div>
            <div className="group cursor-pointer">
              <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3VxIWmUUbcMJPX6Rnzl_njoGdI_xD5bm36o_rxe1M7Q9GWbusuPGAaKWJ1_85p-0lG0WOgXrvKvHpH0LxmXE4NRbJUkzXtd3NFK2ZCi6jX5S84mJ27PZ0k0j4gWwa0SdcnBQtdUfI5srQ7sG6C09Np7uTq8hRhHx_cA-yt6Xr-myTDu8a0rzTNangsZ5EaL7JoCOPeLdFw2UtODpx2fDc4Mu2H0g4SX7955f434B7W0nmc3-kpFOVcpAaDzlj2i5FX_aXP-tAId4')" }}></div>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1">Link Necklace</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">$320.00</p>
            </div>
          </div>
        </section>

        {/* Service Info */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 dark:border-gray-800 py-16">
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary">eco</span>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-2">Conscious Luxury</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">Responsible sourcing and carbon-neutral production for a better future.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary">local_shipping</span>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-2">Priority Shipping</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">Complementary worldwide express shipping on all orders over $300.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-4xl mb-4 text-primary">support_agent</span>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-2">Private Concierge</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">Expert styling advice and personalized support available 24/7.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
