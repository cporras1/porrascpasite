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
    <section id="about" className="py-32">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Values
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {settings.values_tagline || `At ${settings.site_name}, we are committed to outstanding service to our clients`}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {valueTiles.map((tile) => {
            const IconComponent = tile.icon_url ? null : getIconComponent(tile.icon);
            return (
              <div
                key={tile.id}
                className="text-center p-10 glass-card rounded-[2.5rem] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 glass-subtle"
                  style={{ backgroundColor: `${settings.secondary_color}20` }}
                >
                  {tile.icon_url ? (
                    <img src={tile.icon_url} alt={tile.title} className="w-10 h-10 object-contain" />
                  ) : IconComponent ? (
                    <IconComponent size={40} style={{ color: settings.secondary_color }} />
                  ) : null}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tile.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tile.description}
                </p>
              </div>
            );
          })}
        </div>

        {certifications.length > 0 && (
          <div className="mt-20 space-y-8">
            {certifications.map((cert, index) => (
              <div
                key={cert.id}
                className="glass-card rounded-[3rem] p-10 md:p-14 transition-all hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  backgroundColor: index % 2 === 0
                    ? `${settings.accent_color}15`
                    : `${settings.secondary_color}15`
                }}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    {cert.badge_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={cert.badge_url}
                          alt={`${cert.title} Badge`}
                          className="h-28 w-auto object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                        {cert.title}
                      </h3>
                      <p className="text-xl text-gray-700 leading-relaxed">
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
