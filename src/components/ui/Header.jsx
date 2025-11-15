import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import Icon from '../AppIcon';

const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'Home' },
   
    { name: 'AI Chat', href: '/ai-chat', icon: 'MessageSquare' }
  ];

  if (!isAuthenticated) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="Logo_BR.png" 
                alt="BR Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-gradient">BreakinLaw</span>
            </Link>

            {/* Auth Links */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">

                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
           
            <span className="text-xl font-bold text-gradient">BreakinLaw</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation?.map((item) => (
              <Link
                key={item?.name}
                to={item?.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location?.pathname === item?.href
                     ? 'bg-primary/10 text-primary' :'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                {item?.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-gray-600 hidden sm:block">
                {user?.email}
              </span>
            )}
            
            <Link
              to="/account-settings"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Icon name="Settings" size={18} />
            </Link>

            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;