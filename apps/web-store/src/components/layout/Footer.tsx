import Link from 'next/link';
import { Globe, Camera, Mail } from 'lucide-react';
import { Logo } from '../ui/Logo';

const navigationLinks = [
  { href: '/men', label: "Men's Collection" },
  { href: '/women', label: "Women's Collection" },
  { href: '/accessories', label: 'The Accessories' },
  { href: '/editorial', label: 'The Editorial' },
];

const customerCareLinks = [
  { href: '/contact', label: 'Contact Us' },
  { href: '/shipping-returns', label: 'Shipping & Returns' },
  { href: '/sizing-guide', label: 'Sizing Guide' },
  { href: '/faq', label: 'FAQs' },
];

const socialLinks = [
  { href: '#', icon: Globe, label: 'Website' },
  { href: '#', icon: Camera, label: 'Instagram' },
  { href: '#', icon: Mail, label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#1a1c1e] py-20 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="mb-8">
            <Logo className="text-primary" />
          </div>
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
            Redefining modern luxury through conscious design and artistic
            expression since 2012.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-8">
            Navigation
          </h4>
          <ul className="space-y-4 text-sm text-gray-500 font-light">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-8">
            Customer Care
          </h4>
          <ul className="space-y-4 text-sm text-gray-500 font-light">
            {customerCareLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Boutique */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-sm mb-8">
            Boutique
          </h4>
          <p className="text-sm text-gray-500 font-light leading-relaxed">
            124 Fashion Ave
            <br />
            Stockholm, SE 111 20
            <br />
            <span className="mt-4 block">+46 8 123 45 67</span>
            <span className="block">concierge@elitefashion.com</span>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 pt-20 mt-20 border-t border-gray-100 dark:border-gray-800 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} Elite Fashion Retails Group. All rights
        reserved.
      </div>
    </footer>
  );
}
