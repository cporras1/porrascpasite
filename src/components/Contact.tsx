import { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Calendar } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { supabase } from '../lib/supabase';

export function Contact() {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    best_time_to_call: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', best_time_to_call: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (!settings) return null;

  return (
    <section id="contact" className="py-32">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We're here to help. Fill out the form below or contact us directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          <div className="glass-card rounded-[2.5rem] p-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Contact Information
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 glass-subtle"
                  style={{ backgroundColor: `${settings.accent_color}20` }}
                >
                  <MapPin size={28} style={{ color: settings.accent_color }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Address</h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {settings.address_line1}<br />
                    {settings.address_line2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 glass-subtle"
                  style={{ backgroundColor: `${settings.accent_color}20` }}
                >
                  <Phone size={28} style={{ color: settings.accent_color }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Phone</h4>
                  <a href={`tel:${settings.phone}`} className="text-gray-700 hover:text-gray-900 text-lg transition-all hover:scale-105 inline-block">
                    {settings.phone}
                  </a>
                  <p className="text-gray-600 mt-1">
                    Fax: {settings.fax}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 glass-subtle"
                  style={{ backgroundColor: `${settings.accent_color}20` }}
                >
                  <Mail size={28} style={{ color: settings.accent_color }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Email</h4>
                  <a href={`mailto:${settings.email}`} className="text-gray-700 hover:text-gray-900 text-lg transition-all hover:scale-105 inline-block">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 glass-subtle"
                  style={{ backgroundColor: `${settings.accent_color}20` }}
                >
                  <Clock size={28} style={{ color: settings.accent_color }} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-lg">Business Hours</h4>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>

              {settings.calendly_url && (
                <div className="flex items-start gap-5">
                  <div
                    className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 glass-subtle"
                    style={{ backgroundColor: `${settings.accent_color}20` }}
                  >
                    <Calendar size={28} style={{ color: settings.accent_color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">Schedule a Meeting</h4>
                    <a
                      href={settings.calendly_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 rounded-[1.5rem] text-white font-bold transition-all hover:scale-105 hover:shadow-xl mt-2"
                      style={{ backgroundColor: settings.secondary_color }}
                    >
                      Book an Appointment
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-bold text-gray-900 mb-3">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 glass-subtle rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-bold text-gray-900 mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 glass-subtle rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-base font-bold text-gray-900 mb-3">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 glass-subtle rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              <div>
                <label htmlFor="best_time" className="block text-base font-bold text-gray-900 mb-3">
                  Best Time to Call
                </label>
                <input
                  type="text"
                  id="best_time"
                  value={formData.best_time_to_call}
                  onChange={(e) => setFormData({ ...formData, best_time_to_call: e.target.value })}
                  placeholder="e.g., Morning, Afternoon"
                  className="w-full px-5 py-4 glass-subtle rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-bold text-gray-900 mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-4 glass-subtle rounded-[1.5rem] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-5 rounded-[2rem] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50"
                style={{ backgroundColor: settings.secondary_color }}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="p-5 glass-card rounded-[1.5rem] text-green-800 font-semibold bg-green-50/50">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="p-5 glass-card rounded-[1.5rem] text-red-800 font-semibold bg-red-50/50">
                  Sorry, there was an error sending your message. Please try again or contact us directly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
