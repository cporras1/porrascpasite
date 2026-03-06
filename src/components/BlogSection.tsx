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
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
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
    <section id="blog" className="py-32">
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            From Our Blog
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Insights, tips, and updates from our team of experts
          </p>

          <div className="inline-flex glass-card rounded-[2rem] p-2">
            <button
              onClick={() => setViewMode('featured')}
              className={`px-6 py-3 rounded-[1.5rem] text-base font-bold transition-all ${
                viewMode === 'featured'
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:scale-105'
              }`}
              style={viewMode === 'featured' ? { backgroundColor: settings.primary_color } : {}}
            >
              Featured
            </button>
            <button
              onClick={() => setViewMode('popular')}
              className={`px-6 py-3 rounded-[1.5rem] text-base font-bold transition-all ${
                viewMode === 'popular'
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:scale-105'
              }`}
              style={viewMode === 'popular' ? { backgroundColor: settings.primary_color } : {}}
            >
              Popular
            </button>
            <button
              onClick={() => setViewMode('newest')}
              className={`px-6 py-3 rounded-[1.5rem] text-base font-bold transition-all ${
                viewMode === 'newest'
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:scale-105'
              }`}
              style={viewMode === 'newest' ? { backgroundColor: settings.primary_color } : {}}
            >
              Newest
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article
              key={post.id}
              className="glass-card rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {post.featured_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar size={16} />
                    {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-2 font-medium">
                    <Eye size={16} />
                    {post.view_count}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-700 text-base mb-5 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <User size={14} />
                    {post.author_name}
                  </span>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-base font-bold transition-all hover:scale-110"
                    style={{ color: settings.primary_color }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/blog"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-[2rem] text-white font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{ backgroundColor: settings.secondary_color }}
          >
            View All Posts
            <ArrowRight size={22} />
          </a>
        </div>
      </div>
    </section>
  );
}
