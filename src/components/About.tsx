import { Shield, Zap, Award } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function About() {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const values = [
    {
      icon: Shield,
      title: 'Professionalism',
      description: 'By combining our expertise, experience and the energy of our staff, each client receives close personal and professional attention. We are considered one of the leading firms in our area.',
    },
    {
      icon: Zap,
      title: 'Responsiveness',
      description: 'We provide comprehensive financial services to individuals and businesses. We grow through client referrals and are known for competent advice and fast, accurate personnel.',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Our primary goal is to be a trusted advisor providing insightful financial advice. We are committed to continuous professional education to help clients make informed financial decisions.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            At {settings.site_name}, we are committed to outstanding service to our clients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div
                key={value.title}
                className="text-center p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                style={{ '--hover-border-color': settings.accent_color } as any}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${settings.secondary_color}15` }}
                >
                  <IconComponent size={32} style={{ color: settings.secondary_color }} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {(settings.show_ccifp || settings.show_dopecfo) && (
          <div className="mt-16 space-y-8">
            {settings.show_ccifp && (
              <div
                className="rounded-2xl p-8 md:p-12"
                style={{ backgroundColor: `${settings.accent_color}10` }}
              >
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {settings.ccifp_title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {settings.ccifp_description}
                  </p>
                </div>
              </div>
            )}

            {settings.show_dopecfo && (
              <div
                className="rounded-2xl p-8 md:p-12"
                style={{ backgroundColor: `${settings.secondary_color}10` }}
              >
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {settings.dopecfo_title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {settings.dopecfo_description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
