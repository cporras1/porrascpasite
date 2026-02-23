import { useState, useEffect, FormEvent, useRef } from 'react';
import { Plus, Save, Trash2, Upload, X, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type Certification = Database['public']['Tables']['certifications']['Row'];

export function CertificationsEditor() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    badge_url: '',
    is_active: true,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [badgePreview, setBadgePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error loading certifications:', error);
      setMessage({ type: 'error', text: 'Failed to load certifications' });
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const fileName = `cert-badge-${Date.now()}.${fileExt}`;
      const filePath = `badges/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setFormData({ ...formData, badge_url: publicUrl });
      setBadgePreview(publicUrl);
      setMessage({ type: 'success', text: 'Badge uploaded!' });
    } catch (error) {
      console.error('Error uploading badge:', error);
      setMessage({ type: 'error', text: 'Failed to upload badge' });
    } finally {
      setUploading(false);
    }
  };

  const removeBadge = () => {
    setFormData({ ...formData, badge_url: '' });
    setBadgePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      description: cert.description,
      badge_url: cert.badge_url || '',
      is_active: cert.is_active,
    });
    setBadgePreview(cert.badge_url);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', badge_url: '', is_active: true });
    setBadgePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('certifications')
          .update({
            title: formData.title,
            description: formData.description,
            badge_url: formData.badge_url || null,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Certification updated!' });
      } else {
        const maxOrder = certifications.length > 0
          ? Math.max(...certifications.map(c => c.display_order))
          : -1;

        const { error } = await supabase
          .from('certifications')
          .insert([{
            title: formData.title,
            description: formData.description,
            badge_url: formData.badge_url || null,
            is_active: formData.is_active,
            display_order: maxOrder + 1,
          }]);

        if (error) throw error;
        setMessage({ type: 'success', text: 'Certification added!' });
      }

      cancelEdit();
      loadCertifications();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving certification:', error);
      setMessage({ type: 'error', text: 'Failed to save certification' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Certification deleted!' });
      loadCertifications();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting certification:', error);
      setMessage({ type: 'error', text: 'Failed to delete certification' });
    }
  };

  const moveUp = async (cert: Certification, index: number) => {
    if (index === 0) return;

    const newOrder = [...certifications];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];

    try {
      const updates = newOrder.map((item, idx) =>
        supabase
          .from('certifications')
          .update({ display_order: idx })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      await loadCertifications();
    } catch (error) {
      console.error('Error reordering:', error);
      setMessage({ type: 'error', text: 'Failed to reorder certifications' });
    }
  };

  const moveDown = async (cert: Certification, index: number) => {
    if (index === certifications.length - 1) return;

    const newOrder = [...certifications];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

    try {
      const updates = newOrder.map((item, idx) =>
        supabase
          .from('certifications')
          .update({ display_order: idx })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      await loadCertifications();
    } catch (error) {
      console.error('Error reordering:', error);
      setMessage({ type: 'error', text: 'Failed to reorder certifications' });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading certifications...</div>;
  }

  return (
    <div className="space-y-8">
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {editingId ? 'Edit Certification' : 'Add New Certification'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Badge Image
            </label>
            <div className="flex items-start gap-4">
              {badgePreview && (
                <div className="relative">
                  <img
                    src={badgePreview}
                    alt="Badge preview"
                    className="h-20 w-auto object-contain border border-gray-300 rounded-lg p-2 bg-white"
                  />
                  <button
                    type="button"
                    onClick={removeBadge}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                  onChange={handleBadgeUpload}
                  disabled={uploading}
                  className="hidden"
                  id="badge-upload"
                />
                <label
                  htmlFor="badge-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : badgePreview ? 'Change Badge' : 'Upload Badge'}
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Display on website
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              {editingId ? 'Update' : 'Add'} Certification
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Existing Certifications ({certifications.length})
        </h3>

        {certifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">No certifications yet. Add your first one above.</p>
          </div>
        ) : (
          certifications.map((cert, index) => (
            <div
              key={cert.id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(cert, index)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <GripVertical size={20} />
                  </button>
                  <button
                    onClick={() => moveDown(cert, index)}
                    disabled={index === certifications.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <GripVertical size={20} className="rotate-180" />
                  </button>
                </div>

                {cert.badge_url && (
                  <img
                    src={cert.badge_url}
                    alt={cert.title}
                    className="h-16 w-auto object-contain border border-gray-300 rounded p-1"
                  />
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                          cert.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {cert.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(cert)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
