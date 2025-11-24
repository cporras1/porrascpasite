import { Calendar, User, Eye } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';
import { useBlogPosts } from '../hooks/useBlog';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function BlogPage() {
  const { posts, loading } = useBlogPosts();
  const { settings } = useSiteSettings();

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader />

      <main>
        <div className="bg-gradient-to-br from-blue-50 to-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Insights, tips, and updates from our team of experts
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
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
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.view_count}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} />
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
