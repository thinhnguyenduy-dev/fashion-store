import './global.css';
import { Header, Footer } from '@/components/layout';

export const metadata = {
  title: 'ELITE FASHION | High-End Editorial Storefront',
  description:
    'Discover curated luxury fashion from Elite Fashion. Modern tailoring, handcrafted accessories, and conscious design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-background-light text-[#131516] transition-colors duration-300">
        <Header cartItemCount={2} />
        <main className="max-w-[1440px] mx-auto overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
