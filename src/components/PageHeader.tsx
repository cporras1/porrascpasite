import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function PageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 transition-colors" style={{ color: settings.secondary_color }}>
                <Phone size={14} />
                <span>{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 transition-colors" style={{ color: settings.secondary_color }}>
                <Mail size={14} />
                <span className="hidden sm:inline">{settings.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-70" style={{ color: settings.accent_color }}>
                  Facebook
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:opacity-70" style={{ color: settings.accent_color }}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3">
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt={settings.site_name}
                  className="h-12 w-auto object-contain"
                />
              )}
              {settings.show_company_name && (
                <span className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                  {settings.site_name}
                </span>
              )}
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 font-medium transition-colors hover:opacity-70"
                style={{ '--hover-color': settings.secondary_color } as any}
                onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/admin"
              className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
              style={{ backgroundColor: settings.primary_color }}
            >
              Admin Login
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 font-medium transition-colors"
                style={{ '--hover-color': settings.secondary_color } as any}
                onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/admin"
              className="block px-4 py-2 rounded-lg text-white font-medium text-center"
              style={{ backgroundColor: settings.primary_color }}
            >
              Admin Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
