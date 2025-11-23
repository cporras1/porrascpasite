import { useSiteSettings } from '../hooks/useSiteSettings';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { settings } = useSiteSettings();

  if (!settings) return null;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{settings.site_name}</h3>
            <p className="text-gray-400 mb-4">{settings.tagline}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <div>
                  <p>{settings.address_line1}</p>
                  <p>{settings.address_line2}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="flex-shrink-0" style={{ color: settings.accent_color }} />
                <a
                  href={`tel:${settings.phone}`}
                  className="transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="flex-shrink-0" style={{ color: settings.accent_color }} />
                <a
                  href={`mailto:${settings.email}`}
                  className="transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <a
                href="#about"
                className="block transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                About Us
              </a>
              <a
                href="#services"
                className="block transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Our Services
              </a>
              <a
                href="#contact"
                className="block transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Contact
              </a>
              <a
                href="/admin"
                className="block transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.accent_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                Admin Portal
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            {settings.footer_text || `© ${new Date().getFullYear()} ${settings.site_name}. All rights reserved.`}
          </p>
          <div className="flex gap-4">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
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
                className="transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
