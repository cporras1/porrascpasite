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
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading services...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive accounting, tax, and financial services tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon || defaultIcons[index % defaultIcons.length]];

            return (
              <div
                key={service.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${settings.primary_color}15` }}
                >
                  <IconComponent size={28} style={{ color: settings.primary_color }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: settings.secondary_color }}
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
