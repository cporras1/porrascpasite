import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useBlogPosts, usePopularPosts, useNewestPosts } from '../hooks/useBlog';
import { useSiteSettings } from '../hooks/useSiteSettings';

type ViewMode = 'featured' | 'popular' | 'newest';

export function BlogSection() {
  return <BlogSectionContent />;
}

function BlogSectionContent() {
  const [viewMode, setViewMode] = useState<ViewMode>('featured');
  const { posts: featuredPosts, loading: featuredLoading } = useBlogPosts({ featured: true, limit: 3 });
  const { posts: popularPosts, loading: popularLoading } = usePopularPosts(3);
  const { posts: newestPosts, loading: newestLoading } = useNewestPosts(3);
  const { settings } = useSiteSettings();

  if (!settings) return null;

  const loading = featuredLoading || popularLoading || newestLoading;

  const posts = viewMode === 'featured' ? featuredPosts : viewMode === 'popular' ? popularPosts : newestPosts;

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From Our Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Insights, tips, and updates from our team of experts
          </p>

          <div className="inline-flex rounded-lg border border-gray-300 p-1 bg-gray-50">
            <button
              onClick={() => setViewMode('featured')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'featured'
                  ? 'text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={viewMode === 'featured' ? { backgroundColor: settings.primary_color } : {}}
            >
              Featured
            </button>
            <button
              onClick={() => setViewMode('popular')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'popular'
                  ? 'text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={viewMode === 'popular' ? { backgroundColor: settings.primary_color } : {}}
            >
              Popular
            </button>
            <button
              onClick={() => setViewMode('newest')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'newest'
                  ? 'text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={viewMode === 'newest' ? { backgroundColor: settings.primary_color } : {}}
            >
              Newest
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {post.featured_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {post.view_count}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-gray-500">
                    <User size={12} />
                    {post.author_name}
                  </span>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-sm font-semibold transition-colors hover:underline"
                    style={{ color: settings.primary_color }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: settings.secondary_color }}
          >
            View All Posts
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
