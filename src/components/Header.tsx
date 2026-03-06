import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const location = useLocation();

  if (!settings) return null;

  const isHomePage = location.pathname === '/';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: isHomePage ? '#about' : '/#about' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: isHomePage ? '#contact' : '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-3">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 transition-all hover:scale-105" style={{ color: settings.secondary_color }}>
                <Phone size={14} />
                <span className="font-medium">{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 transition-all hover:scale-105" style={{ color: settings.secondary_color }}>
                <Mail size={14} />
                <span className="hidden sm:inline font-medium">{settings.email}</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-105 font-medium" style={{ color: settings.accent_color }}>
                  Facebook
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="transition-all hover:scale-105 font-medium" style={{ color: settings.accent_color }}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-4 transition-transform hover:scale-105">
                {settings.logo_url && (
                  <img
                    src={settings.logo_url}
                    alt={settings.site_name}
                    className="h-14 w-auto object-contain"
                  />
                )}
                {settings.show_company_name && (
                  <span className="text-2xl font-bold" style={{ color: settings.primary_color }}>
                    {settings.site_name}
                  </span>
                )}
              </a>
            </div>

            <div className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 font-semibold transition-all hover:scale-110"
                  style={{ '--hover-color': settings.secondary_color } as any}
                  onMouseEnter={(e) => e.currentTarget.style.color = settings.secondary_color}
                  onMouseLeave={(e) => e.currentTarget.style.color = ''}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/admin"
                className="px-6 py-3 rounded-3xl text-white font-semibold transition-all hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: settings.primary_color }}
              >
                Admin Login
              </a>
            </div>

            <button
              className="md:hidden p-3 rounded-2xl glass-card transition-all hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden glass-strong">
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-3 px-4 rounded-2xl text-gray-700 font-semibold transition-all hover:scale-105 glass-card"
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
              className="block px-6 py-3 rounded-3xl text-white font-semibold text-center transition-all hover:scale-105"
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
