import { useState, useEffect, FormEvent, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export function SiteSettingsEditor() {
  const { settings: initialSettings, loading } = useSiteSettings();
  const [settings, setSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [ccifpBadgePreview, setCcifpBadgePreview] = useState<string | null>(null);
  const [dopecfoBadgePreview, setDopecfoBadgePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ccifpBadgeInputRef = useRef<HTMLInputElement>(null);
  const dopecfoBadgeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
      setLogoPreview(initialSettings.logo_url);
      setCcifpBadgePreview(initialSettings.ccifp_badge_url);
      setDopecfoBadgePreview(initialSettings.dopecfo_badge_url);
    }
  }, [initialSettings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setSettings({ ...settings, logo_url: publicUrl });
      setLogoPreview(publicUrl);
      setMessage({ type: 'success', text: 'Logo uploaded! Click Save to apply changes.' });
    } catch (error) {
      console.error('Error uploading logo:', error);
      setMessage({ type: 'error', text: 'Failed to upload logo. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setSettings({ ...settings, logo_url: null });
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCcifpBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `ccifp-badge-${Date.now()}.${fileExt}`;
      const filePath = `badges/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setSettings({ ...settings, ccifp_badge_url: publicUrl });
      setCcifpBadgePreview(publicUrl);
      setMessage({ type: 'success', text: 'CCIFP badge uploaded! Click Save to apply changes.' });
    } catch (error) {
      console.error('Error uploading badge:', error);
      setMessage({ type: 'error', text: 'Failed to upload badge. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const removeCcifpBadge = () => {
    setSettings({ ...settings, ccifp_badge_url: null });
    setCcifpBadgePreview(null);
    if (ccifpBadgeInputRef.current) {
      ccifpBadgeInputRef.current.value = '';
    }
  };

  const handleDopecfoBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `dopecfo-badge-${Date.now()}.${fileExt}`;
      const filePath = `badges/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setSettings({ ...settings, dopecfo_badge_url: publicUrl });
      setDopecfoBadgePreview(publicUrl);
      setMessage({ type: 'success', text: 'DopeCFO badge uploaded! Click Save to apply changes.' });
    } catch (error) {
      console.error('Error uploading badge:', error);
      setMessage({ type: 'error', text: 'Failed to upload badge. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const removeDopecfoBadge = () => {
    setSettings({ ...settings, dopecfo_badge_url: null });
    setDopecfoBadgePreview(null);
    if (dopecfoBadgeInputRef.current) {
      dopecfoBadgeInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          site_name: settings.site_name,
          tagline: settings.tagline,
          logo_url: settings.logo_url,
          show_company_name: settings.show_company_name,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          phone: settings.phone,
          fax: settings.fax,
          email: settings.email,
          address_line1: settings.address_line1,
          address_line2: settings.address_line2,
          facebook_url: settings.facebook_url,
          linkedin_url: settings.linkedin_url,
          footer_text: settings.footer_text,
          calendly_url: settings.calendly_url,
          show_ccifp: settings.show_ccifp,
          ccifp_title: settings.ccifp_title,
          ccifp_description: settings.ccifp_description,
          ccifp_badge_url: settings.ccifp_badge_url,
          show_dopecfo: settings.show_dopecfo,
          dopecfo_title: settings.dopecfo_title,
          dopecfo_description: settings.dopecfo_description,
          dopecfo_badge_url: settings.dopecfo_badge_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Logo
          </label>
          <div className="flex items-start gap-4">
            {logoPreview && (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 w-auto object-contain border border-gray-300 rounded-lg p-2 bg-white"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Remove logo"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : logoPreview ? 'Change Logo' : 'Upload Logo'}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Recommended: PNG or SVG with transparent background
              </p>
            </div>
          </div>
        </div>
        {logoPreview && (
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.show_company_name}
                onChange={(e) => setSettings({ ...settings, show_company_name: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Display company name alongside logo
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              When unchecked, only the logo will be shown in the header
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Colors</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="h-10 w-20 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="h-10 w-20 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={settings.secondary_color}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="h-10 w-20 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={settings.accent_color}
                onChange={(e) => setSettings({ ...settings, accent_color: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fax
            </label>
            <input
              type="text"
              value={settings.fax}
              onChange={(e) => setSettings({ ...settings, fax: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              value={settings.address_line1}
              onChange={(e) => setSettings({ ...settings, address_line1: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={settings.address_line2}
              onChange={(e) => setSettings({ ...settings, address_line2: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calendly URL
            </label>
            <input
              type="url"
              value={settings.calendly_url || ''}
              onChange={(e) => setSettings({ ...settings, calendly_url: e.target.value })}
              placeholder="https://calendly.com/yourname/meeting"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter your Calendly scheduling link to enable calendar booking in the contact section
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              value={settings.facebook_url || ''}
              onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={settings.linkedin_url || ''}
              onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>

        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_ccifp}
                  onChange={(e) => setSettings({ ...settings, show_ccifp: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Display CCIFP Certification
                </span>
              </label>
            </div>

            {settings.show_ccifp && (
              <div className="space-y-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Image
                  </label>
                  <div className="flex items-start gap-4">
                    {ccifpBadgePreview && (
                      <div className="relative">
                        <img
                          src={ccifpBadgePreview}
                          alt="CCIFP badge preview"
                          className="h-20 w-auto object-contain border border-gray-300 rounded-lg p-2 bg-white"
                        />
                        <button
                          type="button"
                          onClick={removeCcifpBadge}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          aria-label="Remove badge"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={ccifpBadgeInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCcifpBadgeUpload}
                        disabled={uploading}
                        className="hidden"
                        id="ccifp-badge-upload"
                      />
                      <label
                        htmlFor="ccifp-badge-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : ccifpBadgePreview ? 'Change Badge' : 'Upload Badge'}
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: PNG with transparent background
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={settings.ccifp_title}
                    onChange={(e) => setSettings({ ...settings, ccifp_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={settings.ccifp_description}
                    onChange={(e) => setSettings({ ...settings, ccifp_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.show_dopecfo}
                  onChange={(e) => setSettings({ ...settings, show_dopecfo: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Display DopeCFO VIP Pro Member
                </span>
              </label>
            </div>

            {settings.show_dopecfo && (
              <div className="space-y-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Badge Image
                  </label>
                  <div className="flex items-start gap-4">
                    {dopecfoBadgePreview && (
                      <div className="relative">
                        <img
                          src={dopecfoBadgePreview}
                          alt="DopeCFO badge preview"
                          className="h-20 w-auto object-contain border border-gray-300 rounded-lg p-2 bg-white"
                        />
                        <button
                          type="button"
                          onClick={removeDopecfoBadge}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          aria-label="Remove badge"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={dopecfoBadgeInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleDopecfoBadgeUpload}
                        disabled={uploading}
                        className="hidden"
                        id="dopecfo-badge-upload"
                      />
                      <label
                        htmlFor="dopecfo-badge-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : dopecfoBadgePreview ? 'Change Badge' : 'Upload Badge'}
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: PNG with transparent background
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={settings.dopecfo_title}
                    onChange={(e) => setSettings({ ...settings, dopecfo_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={settings.dopecfo_description}
                    onChange={(e) => setSettings({ ...settings, dopecfo_description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Footer Text
          </label>
          <input
            type="text"
            value={settings.footer_text || ''}
            onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
