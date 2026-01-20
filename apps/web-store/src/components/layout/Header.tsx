'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  cartItemCount?: number;
  className?: string;
}

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/editorial', label: 'Editorial' },
  { href: '/collections', label: 'Collections' },
  { href: '/about', label: 'About' },
];

export function Header({ cartItemCount = 0, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white border-b border-solid border-[#e5e7eb] px-6 lg:px-20 py-4',
        className
      )}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-white rounded-full border border-[#e5e7eb] px-4 py-1.5 focus-within:ring-1 ring-primary/30">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-40 placeholder:text-gray-400 ml-2"
              placeholder="Search collection"
              type="text"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="cursor-pointer">
              <Button variant="ghost" size="icon" aria-label="Account" className="cursor-pointer">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/checkout">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
