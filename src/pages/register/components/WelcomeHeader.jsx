import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import RegistrationForm from './RegistrationForm';
import OAuthOptions from './OAuthOptions';

const WelcomeHeader = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
            <Icon name="Scale" size={24} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              BeReady
            </h1>
            <p className="text-sm text-muted-foreground">Legal Guidance</p>
          </div>
        </div>
      </div>

      {/* Improved Headlines - Reduced spacing */}
      <div className="space-y-2">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Instant, secure legal answers for UK residents
        </p>
      </div>

      {/* Main Registration Form - Positioned just under subheadline */}
      <div className="max-w-lg mx-auto">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-xl p-6 sm:p-8">
          
          {/* Social Login - More Prominent */}
          <div className="mb-5">
            <OAuthOptions />
          </div>

          {/* Divider with subtle styling */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500 font-medium">Or create with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="space-y-5">
            <RegistrationForm />
          </div>

        </div>
      </div>

      {/* Key Benefits - Horizontal Line - Moved after form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-6">
        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <Icon name="MessageCircle" size={24} className="text-indigo-600" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900">Ask Anything</h3>
            <p className="text-sm text-gray-600 mt-1">Get instant legal answers</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
            <Icon name="BookOpen" size={24} className="text-violet-600" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900">Save & Track</h3>
            <p className="text-sm text-gray-600 mt-1">Personal legal journal</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900">Expert Guides</h3>
            <p className="text-sm text-gray-600 mt-1">Comprehensive rights info</p>
          </div>
        </div>
      </div>

      {/* Login Link */}
      <div className="pt-3">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default WelcomeHeader;