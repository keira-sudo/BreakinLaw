import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Demo credentials from migration
  const demoCredentials = [
    { role: 'Admin', email: 'admin@beready.uk', password: 'admin123' },
    { role: 'User', email: 'user@beready.uk', password: 'user123' },
    { role: 'Legal Expert', email: 'expert@beready.uk', password: 'expert123' }
  ];

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        setError(error?.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (credentials) => {
    setFormData({
      email: credentials?.email,
      password: credentials?.password
    });
    setError('');
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">{error}</span>
              <button
                type="button"
                onClick={() => navigator?.clipboard?.writeText(error)}
                className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
              >
                Copy Error
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData?.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData?.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        {/* Demo Credentials Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Demo Credentials</h3>
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="text-xs text-blue-600 hover:text-blue-500 font-medium"
            >
              {showDemoCredentials ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showDemoCredentials && (
            <div className="space-y-2">
              {demoCredentials?.map((cred, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-white rounded border text-xs"
                >
                  <div>
                    <div className="font-medium text-gray-700">{cred?.role}</div>
                    <div className="text-gray-500">{cred?.email}</div>
                    <div className="text-gray-500">{cred?.password}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(cred)}
                    className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Use
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                These are test accounts for demonstration purposes only.
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;