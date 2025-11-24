import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useValueTiles } from '../hooks/useValueTiles';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Certification = Database['public']['Tables']['certifications']['Row'];

export function About() {
  const { settings } = useSiteSettings();
  const { valueTiles, loading: tilesLoading } = useValueTiles();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (data) setCertifications(data);
  };

  const getIconComponent = (iconName: string) => {
    return (Icons as any)[iconName] || Icons.Shield;
  };

  if (!settings || tilesLoading) return null;

  return (
    <section id="about" className="pt-32 pb-20 bg-white -mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {settings.values_tagline || `At ${settings.site_name}, we are committed to outstanding service to our clients`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {valueTiles.map((tile) => {
            const IconComponent = tile.icon_url ? null : getIconComponent(tile.icon);
            return (
              <div
                key={tile.id}
                className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                style={{ '--hover-border-color': settings.accent_color } as any}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${settings.secondary_color}15` }}
                >
                  {tile.icon_url ? (
                    <img src={tile.icon_url} alt={tile.title} className="w-8 h-8 object-contain" />
                  ) : IconComponent ? (
                    <IconComponent size={32} style={{ color: settings.secondary_color }} />
                  ) : null}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {tile.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {tile.description}
                </p>
              </div>
            );
          })}
        </div>

        {certifications.length > 0 && (
          <div className="mt-16 space-y-8">
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="rounded-2xl p-8 md:p-12"
                style={{
                  backgroundColor: index % 2 === 0
                    ? `${settings.accent_color}10`
                    : `${settings.secondary_color}10`
                }}
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    {cert.badge_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={cert.badge_url}
                          alt={`${cert.title} Badge`}
                          className="h-24 w-auto object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {cert.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
