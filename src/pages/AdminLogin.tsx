import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      const { error: signUpError } = await signUp(email, password);

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
      } else {
        setSuccess('Account created successfully! You can now sign in.');
        setIsSignUp(false);
        setPassword('');
        setLoading(false);
      }
    } else {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      } else {
        navigate('/admin/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Create Admin Account' : 'Admin Login'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp ? 'Create your admin account' : 'Sign in to manage your website'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading
                ? (isSignUp ? 'Creating Account...' : 'Signing in...')
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setSuccess('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp
                ? '← Back to Sign In'
                : "Don't have an account? Create one"
              }
            </button>
            <div>
              <a href="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Back to Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
