import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

export function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const categories = ['Business', 'Tax', 'QuickBooks', 'Industries'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('category')
      .order('display_order');

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingService({
      id: '',
      category: 'Business',
      title: '',
      slug: '',
      description: '',
      full_content: '',
      icon: null,
      parent_id: null,
      display_order: services.length,
      is_featured: false,
      created_at: '',
      updated_at: '',
    });
  };

  const handleSave = async () => {
    if (!editingService) return;

    try {
      if (isCreating) {
        const { error } = await supabase.from('services').insert([{
          category: editingService.category,
          title: editingService.title,
          slug: editingService.slug,
          description: editingService.description,
          full_content: editingService.full_content,
          display_order: editingService.display_order,
          is_featured: editingService.is_featured,
        }]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .update({
            category: editingService.category,
            title: editingService.title,
            slug: editingService.slug,
            description: editingService.description,
            full_content: editingService.full_content,
            display_order: editingService.display_order,
            is_featured: editingService.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id);

        if (error) throw error;
      }

      setEditingService(null);
      setIsCreating(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (!error) {
      fetchServices();
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  if (editingService) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {isCreating ? 'Create New Service' : 'Edit Service'}
          </h3>
          <button
            onClick={() => {
              setEditingService(null);
              setIsCreating(false);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={editingService.category}
                onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={editingService.title}
                onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL-friendly)
              </label>
              <input
                type="text"
                value={editingService.slug}
                onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={editingService.display_order}
                onChange={(e) => setEditingService({ ...editingService, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              value={editingService.description}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Content
            </label>
            <textarea
              value={editingService.full_content || ''}
              onChange={(e) => setEditingService({ ...editingService, full_content: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={editingService.is_featured}
              onChange={(e) => setEditingService({ ...editingService, is_featured: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
              Featured on homepage
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            Save Service
          </button>
          <button
            onClick={() => {
              setEditingService(null);
              setIsCreating(false);
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Services</h3>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {category}
          </h4>
          <div className="space-y-2">
            {categoryServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-gray-900">{service.title}</h5>
                    {service.is_featured && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
