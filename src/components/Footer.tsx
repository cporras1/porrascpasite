import { useSiteSettings } from '../hooks/useSiteSettings';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  return (
    <footer className="relative mt-32 py-16">
      <div className="glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{settings.site_name}</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{settings.tagline}</p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="mt-1 flex-shrink-0" style={{ color: settings.accent_color }} />
                  <div className="text-gray-700 leading-relaxed">
                    <p>{settings.address_line1}</p>
                    <p>{settings.address_line2}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={20} className="flex-shrink-0" style={{ color: settings.accent_color }} />
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-gray-700 font-medium transition-all hover:scale-105"
                    onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={20} className="flex-shrink-0" style={{ color: settings.accent_color }} />
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-gray-700 font-medium transition-all hover:scale-105"
                    onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h4>
              <nav className="space-y-3">
                <a
                  href="#about"
                  className="block text-gray-700 font-medium transition-all hover:scale-105"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  About Us
                </a>
                <a
                  href="#services"
                  className="block text-gray-700 font-medium transition-all hover:scale-105"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  Our Services
                </a>
                <a
                  href="#contact"
                  className="block text-gray-700 font-medium transition-all hover:scale-105"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  Contact
                </a>
                <a
                  href="/admin"
                  className="block text-gray-700 font-medium transition-all hover:scale-105"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  Admin Portal
                </a>
              </nav>
            </div>
          </div>

          <div className="glass-subtle rounded-[2rem] mt-12 py-6 px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-base text-gray-700 font-medium">
              {settings.footer_text || `© ${new Date().getFullYear()} ${settings.site_name}. All rights reserved.`}
            </p>
            <div className="flex gap-6">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-medium transition-all hover:scale-110"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  Facebook
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 font-medium transition-all hover:scale-110"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
