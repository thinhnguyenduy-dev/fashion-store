import { Button } from '../ui/Button';

export interface HeroSectionProps {
  subtitle: string;
  title: string;
  backgroundImage: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function HeroSection({
  subtitle,
  title,
  backgroundImage,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="px-6 lg:px-20 py-8">
      <div className="relative w-full h-[75vh] overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url("${backgroundImage}")`,
          }}
        />
        <div className="absolute bottom-16 left-12 max-w-2xl text-white">
          <p className="uppercase tracking-[0.3em] text-sm mb-4 font-light">
            {subtitle}
          </p>
          <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tighter">
            {title}
          </h2>
          <div className="flex gap-4">
            <a href={primaryCta.href}>
              <Button className="tracking-wide transform hover:translate-y-[-2px]">
                {primaryCta.label}
              </Button>
            </a>
            {secondaryCta && (
              <a href={secondaryCta.href}>
                <Button variant="secondary" className="tracking-wide">
                  {secondaryCta.label}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
