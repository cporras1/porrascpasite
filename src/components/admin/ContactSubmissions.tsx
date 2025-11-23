import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export function ContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();

    const channel = supabase
      .channel('contact_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_submissions' }, () => {
        fetchSubmissions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status: 'read' })
      .eq('id', id);

    if (!error) {
      fetchSubmissions();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading submissions...</div>;
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No contact submissions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Contact Submissions ({submissions.length})
        </h3>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className={`border rounded-lg p-6 ${
              submission.status === 'new'
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {submission.name}
                </h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <a
                    href={`mailto:${submission.email}`}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <Mail size={14} />
                    {submission.email}
                  </a>
                  {submission.phone && (
                    <a
                      href={`tel:${submission.phone}`}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      <Phone size={14} />
                      {submission.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {submission.status === 'new' && (
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    New
                  </span>
                )}
                {submission.status === 'new' && (
                  <button
                    onClick={() => markAsRead(submission.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <CheckCircle size={14} />
                    Mark as Read
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-3">
              <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(submission.created_at)}
              </div>
              {submission.best_time_to_call && (
                <div>
                  Best time to call: <span className="font-medium">{submission.best_time_to_call}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
