import { Building2, FileText, Calculator, Briefcase, Users, TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';
import { useServices } from '../hooks/useServices';
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

export function ServicesPage() {
  const { services, loading } = useServices();
  const { settings } = useSiteSettings();

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      <main className="pt-0">
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive accounting, tax, and financial services tailored to your needs
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {Object.entries(groupedServices).map(([category, categoryServices]) => (
            <div key={category} className="mb-16 last:mb-0">
              <h2
                className="text-3xl font-bold mb-8 pb-4 border-b-2"
                style={{ color: settings.primary_color, borderColor: `${settings.primary_color}40` }}
              >
                {category}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryServices.map((service, index) => {
                  const IconComponent = iconMap[service.icon || defaultIcons[index % defaultIcons.length]];

                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
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
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      {service.full_content && (
                        <div className="text-sm text-gray-500 leading-relaxed">
                          {service.full_content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss how we can help with your accounting and tax needs.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: settings.secondary_color }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
