import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, FileText, Briefcase, Mail, Users, PenLine } from 'lucide-react';
import { SiteSettingsEditor } from '../components/admin/SiteSettingsEditor';
import { ServicesEditor } from '../components/admin/ServicesEditor';
import { ContactSubmissions } from '../components/admin/ContactSubmissions';
import { BlogEditor } from '../components/admin/BlogEditor';

type Tab = 'settings' | 'services' | 'contact' | 'blog';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  if (!user) {
    navigate('/admin');
    return null;
  }

  const tabs = [
    { id: 'settings' as Tab, label: 'Site Settings', icon: Settings },
    { id: 'services' as Tab, label: 'Services', icon: Briefcase },
    { id: 'blog' as Tab, label: 'Blog Posts', icon: PenLine },
    { id: 'contact' as Tab, label: 'Contact Submissions', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your website content</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Website →
              </a>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'settings' && <SiteSettingsEditor />}
            {activeTab === 'services' && <ServicesEditor />}
            {activeTab === 'blog' && <BlogEditor />}
            {activeTab === 'contact' && <ContactSubmissions />}
          </div>
        </div>
      </div>
    </div>
  );
}
