import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate(redirectPath);
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                  <g>
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.44 1.22 8.44 3.22l6.28-6.28C34.64 2.36 29.74 0 24 0 14.82 0 6.98 5.82 3.24 14.26l7.44 5.78C12.36 13.36 17.64 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.74H24v9.24h12.44c-.54 2.92-2.18 5.38-4.64 7.04l7.44 5.78C43.98 37.18 46.1 31.36 46.1 24.5z"/>
                    <path fill="#FBBC05" d="M10.68 28.04c-.48-1.44-.76-2.98-.76-4.54s.28-3.1.76-4.54l-7.44-5.78C2.36 16.64 0 20.36 0 24.5s2.36 7.86 6.24 10.32l7.44-5.78z"/>
                    <path fill="#EA4335" d="M24 46c6.48 0 11.92-2.14 15.88-5.82l-7.44-5.78c-2.06 1.38-4.7 2.2-8.44 2.2-6.36 0-11.64-3.86-13.32-9.54l-7.44 5.78C6.98 42.18 14.82 46 24 46z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </g>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;