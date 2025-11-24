import { useState, useEffect, FormEvent, useCallback } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Move, ZoomIn } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';

type HeroContent = Database['public']['Tables']['hero_content']['Row'];
type ValueTile = Database['public']['Tables']['value_tiles']['Row'];
type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

const availableIcons = [
  'Shield', 'Zap', 'Award', 'Target', 'TrendingUp', 'Users',
  'Heart', 'Star', 'CheckCircle', 'Globe', 'Lock', 'Lightbulb',
  'Rocket', 'ThumbsUp', 'Clock', 'BookOpen', 'Briefcase', 'Calendar'
];

export function HeroValuesEditor() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [valueTiles, setValueTiles] = useState<ValueTile[]>([]);
  const [valuesTagline, setValuesTagline] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(50);
  const [opacity, setOpacity] = useState(0.5);
  const [showImageAdjust, setShowImageAdjust] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [heroRes, tilesRes, settingsRes] = await Promise.all([
        supabase.from('hero_content').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('value_tiles').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('values_tagline').limit(1).maybeSingle()
      ]);

      if (heroRes.data) {
        setHeroContent(heroRes.data);
        setZoom(Number(heroRes.data.hero_image_scale) || 1);
        setPositionX(Number(heroRes.data.hero_image_position_x) || 50);
        setPositionY(Number(heroRes.data.hero_image_position_y) || 50);
        setOpacity(Number(heroRes.data.hero_image_opacity) ?? 0.5);
      }
      if (tilesRes.data) setValueTiles(tilesRes.data);
      if (settingsRes.data) setValuesTagline(settingsRes.data.values_tagline || '');
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setHeroContent(prev => prev ? {
        ...prev,
        hero_image_url: publicUrl,
        hero_image_scale: 1,
        hero_image_position_x: 50,
        hero_image_position_y: 50,
        hero_image_opacity: 0.5
      } : null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setShowImageAdjust(true);
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image.' });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemoveImage = () => {
    setHeroContent(prev => prev ? {
      ...prev,
      hero_image_url: null,
      hero_image_scale: 1,
      hero_image_position_x: 50,
      hero_image_position_y: 50
    } : null);
    setShowImageAdjust(false);
  };

  const handlePositionChange = () => {
    if (!heroContent) return;
    setHeroContent(prev => prev ? {
      ...prev,
      hero_image_scale: zoom,
      hero_image_position_x: positionX,
      hero_image_position_y: positionY,
      hero_image_opacity: opacity
    } : null);
  };

  useEffect(() => {
    if (showImageAdjust) {
      handlePositionChange();
    }
  }, [zoom, positionX, positionY, opacity, showImageAdjust]);

  const handleHeroSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (heroContent?.id) {
        const { error } = await supabase
          .from('hero_content')
          .update({
            heading: heroContent.heading,
            subheading: heroContent.subheading,
            hero_image_url: heroContent.hero_image_url,
            hero_image_scale: heroContent.hero_image_scale,
            hero_image_position_x: heroContent.hero_image_position_x,
            hero_image_position_y: heroContent.hero_image_position_y,
            hero_image_opacity: heroContent.hero_image_opacity,
            updated_at: new Date().toISOString()
          })
          .eq('id', heroContent.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('hero_content')
          .insert({
            heading: heroContent?.heading || '',
            subheading: heroContent?.subheading || '',
            hero_image_url: heroContent?.hero_image_url || null,
            hero_image_scale: heroContent?.hero_image_scale || 1,
            hero_image_position_x: heroContent?.hero_image_position_x || 50,
            hero_image_position_y: heroContent?.hero_image_position_y || 50,
            hero_image_opacity: heroContent?.hero_image_opacity ?? 0.5
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setHeroContent(data);
      }

      setMessage({ type: 'success', text: 'Hero content saved successfully!' });
    } catch (error) {
      console.error('Error saving hero:', error);
      setMessage({ type: 'error', text: 'Failed to save hero content.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleValuesTaglineSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ values_tagline: valuesTagline })
        .eq('id', 1);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Values tagline saved successfully!' });
    } catch (error) {
      console.error('Error saving tagline:', error);
      setMessage({ type: 'error', text: 'Failed to save tagline.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleTileSave = async (tile: ValueTile) => {
    try {
      const { error } = await supabase
        .from('value_tiles')
        .update({
          title: tile.title,
          description: tile.description,
          icon: tile.icon,
          icon_url: tile.icon_url,
          is_active: tile.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', tile.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Value tile saved!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving tile:', error);
      setMessage({ type: 'error', text: 'Failed to save tile.' });
    }
  };

  const handleAddTile = async () => {
    try {
      const maxOrder = Math.max(...valueTiles.map(t => t.display_order), 0);
      const { data, error } = await supabase
        .from('value_tiles')
        .insert({
          title: 'New Value',
          description: 'Description here',
          icon: 'Shield',
          display_order: maxOrder + 1,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      if (data) setValueTiles([...valueTiles, data]);
    } catch (error) {
      console.error('Error adding tile:', error);
      setMessage({ type: 'error', text: 'Failed to add tile.' });
    }
  };

  const handleDeleteTile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this value tile?')) return;

    try {
      const { error } = await supabase.from('value_tiles').delete().eq('id', id);
      if (error) throw error;
      setValueTiles(valueTiles.filter(t => t.id !== id));
      setMessage({ type: 'success', text: 'Value tile deleted!' });
    } catch (error) {
      console.error('Error deleting tile:', error);
      setMessage({ type: 'error', text: 'Failed to delete tile.' });
    }
  };

  const updateTile = (id: string, updates: Partial<ValueTile>) => {
    setValueTiles(valueTiles.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const getIconComponent = (iconName: string) => {
    return (Icons as any)[iconName] || Icons.Shield;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hero Section</h2>
        <form onSubmit={handleHeroSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Heading
            </label>
            <input
              type="text"
              value={heroContent?.heading || ''}
              onChange={(e) => setHeroContent(prev => prev ? { ...prev, heading: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tagline
            </label>
            <textarea
              value={heroContent?.subheading || ''}
              onChange={(e) => setHeroContent(prev => prev ? { ...prev, subheading: e.target.value } : null)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image (Optional)
            </label>
            {heroContent?.hero_image_url ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setShowImageAdjust(!showImageAdjust)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Move size={16} />
                    {showImageAdjust ? 'Hide' : 'Adjust'} Position & Zoom
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Remove Image
                  </button>
                </div>

                {showImageAdjust ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-white rounded-lg overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${heroContent.hero_image_url})`,
                          backgroundSize: `${zoom * 100}%`,
                          backgroundPosition: `${positionX}% ${positionY}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"
                        style={{ opacity: opacity }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <ZoomIn size={16} />
                          Scale: {Math.round(zoom * 100)}%
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={3}
                          step={0.1}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Move size={16} />
                          Horizontal Position: {positionX}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={positionX}
                          onChange={(e) => setPositionX(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Move size={16} className="rotate-90" />
                          Vertical Position: {positionY}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={positionY}
                          onChange={(e) => setPositionY(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <ImageIcon size={16} />
                          Overlay Opacity: {Math.round(opacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={opacity}
                          onChange={(e) => setOpacity(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Adjust image position and scale. Use overlay opacity to control image visibility - lower values show more of the image, higher values make text more readable. Changes will be saved when you click "Save Hero Content".
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={heroContent.hero_image_url}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading...</p>
                )}
                <p className="text-xs text-gray-500">
                  Upload an image to display on the hero section. Recommended size: 1920x1080px
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Hero Content'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Values Section</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Values Section Tagline
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={valuesTagline}
              onChange={(e) => setValuesTagline(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleValuesTaglineSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              Save
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {valueTiles.map((tile) => {
            const IconComponent = getIconComponent(tile.icon);
            return (
              <div key={tile.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <GripVertical className="text-gray-400 flex-shrink-0 mt-2" size={20} />
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={tile.title}
                          onChange={(e) => updateTile(tile.id, { title: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Value Title"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select
                          value={tile.icon}
                          onChange={(e) => updateTile(tile.id, { icon: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {availableIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Icon URL</label>
                        <input
                          type="text"
                          value={tile.icon_url || ''}
                          onChange={(e) => updateTile(tile.id, { icon_url: e.target.value })}
                          placeholder="Optional custom icon URL"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <textarea
                      value={tile.description}
                      onChange={(e) => updateTile(tile.id, { description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Value Description"
                    />

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={tile.is_active}
                          onChange={(e) => updateTile(tile.id, { is_active: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTileSave(tile)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Save size={16} />
                          Save
                        </button>
                        <button
                          onClick={() => handleDeleteTile(tile.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleAddTile}
          className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Value Tile
        </button>
      </div>
    </div>
  );
}
