
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-28 flex flex-col gap-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#6c7a7f]">Filters</h3>
            <button className="text-xs text-primary font-bold hover:underline">Clear All</button>
          </div>
          <div className="h-[1px] bg-[#e5e7e6] w-full"></div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-between w-full group">
            <span className="text-sm font-semibold">Category</span>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-primary" />
          </button>
          <div className="flex flex-col gap-2 ml-1">
             {['Dresses', 'Outerwear', 'Knitwear', 'Accessories'].map((item) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="rounded border-[#e5e7e6] text-primary focus:ring-primary h-4 w-4" defaultChecked={item === 'Outerwear'} />
                  <span className="text-sm text-[#131516] group-hover:text-primary transition-colors">{item}</span>
                </label>
             ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-between w-full">
            <span className="text-sm font-semibold">Price Range</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="px-2">
            <input className="w-full h-1 bg-[#e5e7e6] rounded-lg appearance-none cursor-pointer accent-primary" type="range" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[#6c7a7f]">$100</span>
              <span className="text-xs text-[#6c7a7f]">$5000</span>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-between w-full">
             <span className="text-sm font-semibold">Size</span>
             <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          <div className="grid grid-cols-4 gap-2">
            {['XXS', 'XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button key={size} className={cn(
                "h-8 border text-[10px] flex items-center justify-center transition-colors",
                size === 'XS' 
                  ? "border-primary bg-primary/10" 
                  : "border-[#e5e7e6] hover:border-primary"
              )}>
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex flex-col gap-4">
           <button className="flex items-center justify-between w-full">
             <span className="text-sm font-semibold">Color</span>
             <ChevronDown className="w-4 h-4 text-gray-500" />
           </button>
           <div className="flex flex-wrap gap-2">
             <button className="size-6 rounded-full bg-[#131516] ring-1 ring-offset-2 ring-transparent hover:ring-primary"></button>
             <button className="size-6 rounded-full bg-[#f8f8f7] ring-1 ring-[#e5e7e6] hover:ring-primary"></button>
             <button className="size-6 rounded-full bg-[#316272] ring-1 ring-offset-2 ring-primary"></button>
             <button className="size-6 rounded-full bg-[#d2b48c] ring-1 ring-offset-2 ring-transparent hover:ring-primary"></button>
             <button className="size-6 rounded-full bg-[#556b2f] ring-1 ring-offset-2 ring-transparent hover:ring-primary"></button>
           </div>
        </div>
        
         {/* Sustainability */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-2 w-full text-green-700">
            <span className="material-symbols-outlined text-xl">eco</span> 
            {/* Note: I'll need to use Leaf icon from lucide or enable google fonts. I'll use text for now or icon */}
             <span className="text-sm font-semibold">Sustainability</span>
          </button>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input className="rounded border-[#e5e7e6] text-primary focus:ring-primary h-4 w-4" type="checkbox"/>
            <span className="text-sm text-[#131516] group-hover:text-primary transition-colors">Organic Fabrics</span>
          </label>
        </div>

      </div>
    </aside>
  );
}
