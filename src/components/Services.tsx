import { Building2, FileText, Calculator, Briefcase, Users, TrendingUp } from 'lucide-react';
import { useFeaturedServices } from '../hooks/useServices';
import { useSiteSettings } from '../hooks/useSiteSettings';

const iconMap: Record<string, any> = {
  Building2,
  FileText,
  Calculator,
  Briefcase,
  Users,
  TrendingUp,
};

const defaultIcons = ['Building2', 'FileText', 'Calculator', 'Briefcase', 'Users', 'TrendingUp'];

export function Services() {
  const { services, loading } = useFeaturedServices();
  const { settings } = useSiteSettings();

  if (loading || !settings) {
    return (
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center">
            <div className="animate-pulse">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-32">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive accounting, tax, and financial services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || defaultIcons[index % defaultIcons.length]];

            return (
              <div
                key={service.id}
                className="glass-card rounded-[2.5rem] p-10 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div
                  className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6 glass-subtle"
                  style={{ backgroundColor: `${settings.primary_color}20` }}
                >
                  <IconComponent size={36} style={{ color: settings.primary_color }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <a
            href="/services"
            className="inline-flex items-center justify-center px-10 py-5 rounded-[2rem] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: settings.secondary_color }}
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
