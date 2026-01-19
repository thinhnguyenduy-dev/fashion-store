
import { Sidebar } from "@/components/category/Sidebar";
import { ProductGrid } from "@/components/category/ProductGrid";
import { ChevronDown } from "lucide-react";

export default function CategoryPage() {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-10 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6">
        <a href="#" className="text-[#6c7a7f] text-sm font-medium hover:text-primary">Home</a>
        <span className="text-[#6c7a7f] text-sm">/</span>
        <a href="#" className="text-[#6c7a7f] text-sm font-medium hover:text-primary">Women</a>
        <span className="text-[#6c7a7f] text-sm">/</span>
        <span className="text-primary text-sm font-medium">New Arrivals</span>
      </div>

      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-4 text-[#131516]">New Arrivals</h1>
        <p className="text-[#6c7a7f] text-lg max-w-2xl font-light">
          Explore our latest curation of high-end essentials, merging architectural silhouettes with sustainable craftsmanship.
        </p>
      </div>

      <div className="flex gap-12">
        {/* Sidebar Filters */}
        <Sidebar />

        {/* Product Grid Content */}
        <div className="flex-1">
          {/* ToolBar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e5e7e6]">
            <span className="text-sm text-[#6c7a7f] font-medium">128 Products found</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 group cursor-pointer relative">
                <span className="text-xs font-bold uppercase tracking-widest text-[#131516]">Sort By: Featured</span>
                <ChevronDown className="w-4 h-4 text-[#131516]" />
              </div>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid />

          {/* Pagination */}
          <div className="mt-20 flex flex-col items-center gap-6">
            <p className="text-sm text-[#6c7a7f]">Viewing 6 of 128 products</p>
            <div className="w-64 h-1 bg-[#e5e7e6] rounded-full overflow-hidden">
               <div className="w-1/12 h-full bg-primary"></div>
            </div>
            <button className="px-12 py-4 border border-[#131516] text-xs font-bold uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all">
                Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
