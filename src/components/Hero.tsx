import { useSiteSettings } from '../hooks/useSiteSettings';
import { useHeroContent } from '../hooks/useHeroContent';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const { settings } = useSiteSettings();
  const { heroContent, loading } = useHeroContent();

  if (!settings || loading) return null;

  const heading = heroContent?.heading || 'Professional Accounting & Tax Services';
  const subheading = heroContent?.subheading || 'Combining expertise, experience, and dedication to provide outstanding service to our clients in El Paso and surrounding areas.';

  const imageScale = Number(heroContent?.hero_image_scale) || 1;
  const imagePosX = Number(heroContent?.hero_image_position_x) || 50;
  const imagePosY = Number(heroContent?.hero_image_position_y) || 50;
  const overlayOpacity = Number(heroContent?.hero_image_opacity) ?? 0.5;

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {heroContent?.hero_image_url && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${heroContent.hero_image_url})`,
              backgroundSize: `${imageScale * 100}%`,
              backgroundPosition: `${imagePosX}% ${imagePosY}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div
            className="absolute inset-0 z-10 bg-gradient-to-br from-blue-50/50 to-white/50 backdrop-blur-sm"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 relative z-20">
        <div className="max-w-4xl">
          <div className="glass-card rounded-[3rem] p-12 md:p-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {heading}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
              {subheading}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-10 py-5 rounded-[2rem] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{ backgroundColor: settings.primary_color }}
              >
                Get Started
                <ArrowRight className="ml-3" size={22} />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center px-10 py-5 rounded-[2rem] font-bold text-lg transition-all hover:scale-105 glass-strong"
                style={{ color: settings.secondary_color }}
              >
                Our Services
              </a>
            </div>
          </div>
        </div>
      </div>

      {!heroContent?.hero_image_url && (
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l opacity-20 pointer-events-none blur-3xl"
          style={{
            backgroundImage: `linear-gradient(to left, ${settings.accent_color}40, transparent)`
          }}
        />
      )}
    </section>
  );
}
