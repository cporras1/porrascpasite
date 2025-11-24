import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, ArrowLeft } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Footer } from '../components/Footer';
import { useBlogPost } from '../hooks/useBlog';
import { useSiteSettings } from '../hooks/useSiteSettings';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { post, loading } = useBlogPost(slug || '');
  const { settings } = useSiteSettings();

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <PageHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: settings.primary_color }}
            >
              <ArrowLeft size={18} />
              Back to Blog
            </button>
          </div>
        </main>
        <Footer />
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </button>

          {post.featured_image_url && (
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <span className="flex items-center gap-2">
                <User size={18} />
                {post.author_name}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} />
                {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={18} />
                {post.view_count} views
              </span>
            </div>
          </header>

          {post.excerpt && (
            <div className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200">
              {post.excerpt}
            </div>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-700 prose-li:mb-2 prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-gray-900 prose-img:rounded-lg prose-img:shadow-md"
            style={{
              '--tw-prose-links': settings.primary_color,
            } as any}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="bg-gray-50 py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today to learn more about our services
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: settings.secondary_color }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
