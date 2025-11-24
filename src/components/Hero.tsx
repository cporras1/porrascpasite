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
    <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 md:py-32 overflow-hidden">
      {heroContent?.hero_image_url && (
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url(${heroContent.hero_image_url})`,
              backgroundSize: `${imageScale * 100}%`,
              backgroundPosition: `${imagePosX}% ${imagePosY}%`,
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"
            style={{ opacity: overlayOpacity }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            {subheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: settings.primary_color }}
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 font-semibold text-lg transition-all"
              style={{ borderColor: settings.secondary_color, color: settings.secondary_color, backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${settings.secondary_color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Our Services
            </a>
          </div>
        </div>
      </div>

      {!heroContent?.hero_image_url && (
        <div
          className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to left, ${settings.accent_color}40, transparent)`
          }}
        />
      )}
    </section>
  );
}
