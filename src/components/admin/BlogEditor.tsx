import { useState, useEffect, FormEvent, useRef } from 'react';
import { Save, Upload, X, Sparkles, Lightbulb, Search, Trash2, Eye, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import type { Database } from '../../lib/database.types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export function BlogEditor() {
  const { settings } = useSiteSettings();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiMode, setAIMode] = useState<'brainstorm' | 'research' | 'generate'>('brainstorm');
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [aiLoading, setAILoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  }

  const createNewPost = () => {
    setEditing({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image_url: null,
      author_name: 'Admin',
      is_featured: false,
      is_published: false,
      view_count: 0,
      published_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setShowAI(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    if (!editing) return;
    const slug = generateSlug(title);
    setEditing({ ...editing, title, slug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      setEditing({ ...editing, featured_image_url: publicUrl });
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleAIAssist = async () => {
    if (!aiPrompt.trim()) return;

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      setAIResponse('AI assistance is not available. Please make sure you have configured the Anthropic API key in your environment variables.');
      return;
    }

    setAILoading(true);
    setAIResponse('');

    try {
      let systemPrompt = '';
      if (aiMode === 'brainstorm') {
        systemPrompt = 'You are a creative content strategist. Generate 5-7 compelling blog post ideas based on the topic. Include catchy titles and brief descriptions.';
      } else if (aiMode === 'research') {
        systemPrompt = 'You are a research assistant. Provide key facts, statistics, and insights about the topic that would be valuable for a blog post.';
      } else {
        systemPrompt = 'You are a professional blog content writer. Create engaging, well-structured blog content in HTML format with proper headings, paragraphs, and formatting.';
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nTopic: ${aiPrompt}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const content = data.content[0].text;
      setAIResponse(content);

      if (aiMode === 'generate' && editing && contentRef.current) {
        const currentContent = editing.content || '';
        const newContent = currentContent + '\n\n' + content;
        setEditing({ ...editing, content: newContent });
      }
    } catch (error) {
      console.error('Error with AI assist:', error);
      setAIResponse('AI assistance is not available. Please make sure you have configured the Anthropic API key in your environment variables.');
    } finally {
      setAILoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    setSaving(true);
    setMessage(null);

    try {
      const postData = {
        title: editing.title,
        slug: editing.slug,
        excerpt: editing.excerpt || null,
        content: editing.content,
        featured_image_url: editing.featured_image_url,
        author_name: editing.author_name,
        is_featured: editing.is_featured,
        is_published: editing.is_published,
        published_at: editing.is_published && !editing.published_at ? new Date().toISOString() : editing.published_at,
      };

      if (editing.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ ...postData, updated_at: new Date().toISOString() })
          .eq('id', editing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Blog post saved successfully!' });
      setEditing(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ type: 'error', text: 'Failed to save blog post' });
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Blog post deleted successfully!' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage({ type: 'error', text: 'Failed to delete blog post' });
    }
  };

  const insertFormatting = (tag: string) => {
    if (!contentRef.current || !editing) return;

    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editing.content.substring(start, end);

    let formattedText = '';
    if (tag === 'h2') {
      formattedText = `<h2>${selectedText || 'Heading'}</h2>`;
    } else if (tag === 'h3') {
      formattedText = `<h3>${selectedText || 'Subheading'}</h3>`;
    } else if (tag === 'p') {
      formattedText = `<p>${selectedText || 'Paragraph text'}</p>`;
    } else if (tag === 'strong') {
      formattedText = `<strong>${selectedText || 'bold text'}</strong>`;
    } else if (tag === 'em') {
      formattedText = `<em>${selectedText || 'italic text'}</em>`;
    } else if (tag === 'ul') {
      formattedText = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`;
    } else if (tag === 'a') {
      formattedText = `<a href="https://example.com">${selectedText || 'link text'}</a>`;
    }

    const newContent =
      editing.content.substring(0, start) + formattedText + editing.content.substring(end);

    setEditing({ ...editing, content: newContent });
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  if (!editing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <button
            onClick={createNewPost}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            New Post
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    {post.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                        Featured
                      </span>
                    )}
                    {post.is_published ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{post.author_name}</span>
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {post.view_count} views
                    </span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setEditing(post)}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No blog posts yet. Create your first post to get started!
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {editing.id ? 'Edit Blog Post' : 'New Blog Post'}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles size={18} />
            AI Assistant
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setMessage(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {showAI && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600" />
            AI Content Assistant
          </h3>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setAIMode('brainstorm')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                aiMode === 'brainstorm'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-100'
              }`}
            >
              <Lightbulb size={16} />
              Brainstorm
            </button>
            <button
              type="button"
              onClick={() => setAIMode('research')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                aiMode === 'research'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-100'
              }`}
            >
              <Search size={16} />
              Research
            </button>
            <button
              type="button"
              onClick={() => setAIMode('generate')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                aiMode === 'generate'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-purple-100'
              }`}
            >
              <Sparkles size={16} />
              Generate
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                placeholder={
                  aiMode === 'brainstorm'
                    ? 'Enter a topic to brainstorm blog ideas...'
                    : aiMode === 'research'
                    ? 'Enter a topic to research...'
                    : 'Describe the content you want to generate...'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <button
              type="button"
              onClick={handleAIAssist}
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <Sparkles size={18} />
              {aiLoading ? 'Generating...' : 'Generate'}
            </button>

            {aiResponse && (
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">{aiResponse}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={editing.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
          <input
            type="text"
            value={editing.slug}
            onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
        <input
          type="text"
          value={editing.author_name}
          onChange={(e) => setEditing({ ...editing, author_name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          value={editing.excerpt || ''}
          onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
          placeholder="A short summary that appears in blog listings..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
        <div className="flex items-start gap-4">
          {editing.featured_image_url && (
            <div className="relative">
              <img
                src={editing.featured_image_url}
                alt="Featured"
                className="h-32 w-auto object-contain border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setEditing({ ...editing, featured_image_url: null })}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
              id="featured-image-upload"
            />
            <label
              htmlFor="featured-image-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <Upload size={18} />
              {uploading ? 'Uploading...' : editing.featured_image_url ? 'Change Image' : 'Upload Image'}
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML)</label>
        <div className="mb-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => insertFormatting('h2')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">H2</button>
          <button type="button" onClick={() => insertFormatting('h3')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">H3</button>
          <button type="button" onClick={() => insertFormatting('p')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">P</button>
          <button type="button" onClick={() => insertFormatting('strong')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"><strong>B</strong></button>
          <button type="button" onClick={() => insertFormatting('em')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"><em>I</em></button>
          <button type="button" onClick={() => insertFormatting('ul')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">List</button>
          <button type="button" onClick={() => insertFormatting('a')} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Link</button>
        </div>
        <textarea
          ref={contentRef}
          value={editing.content}
          onChange={(e) => setEditing({ ...editing, content: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          rows={15}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editing.is_published}
            onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Published</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editing.is_featured}
            onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Featured</span>
        </label>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}
