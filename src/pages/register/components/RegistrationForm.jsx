import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const validatePassword = (password) => {
    return password?.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAgreementChange = (field, checked) => {
    setAgreements(prev => ({ ...prev, [field]: checked }));
    
    // Clear error when user checks agreement
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData?.email) {
      newErrors.email = 'Please enter your email address';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Please create a password';
    } else if (!validatePassword(formData?.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreements?.terms) {
      newErrors.terms = 'You must accept the Terms of Service to continue';
    }

    if (!agreements?.privacy) {
      newErrors.privacy = 'You must accept the Privacy Policy to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signUp(formData?.email, formData?.password, {
        fullName: formData?.fullName,
        role: 'user'
      });
      
      if (error) {
        setErrors({ submit: error?.message });
      } else {
        // Navigate to dashboard after successful registration
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Simplified Form - Main Block */}
      <div className="space-y-4">
        {/* Full Name Field */}
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
          className="text-base"
        />
        
        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="text-base"
        />
        
        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a secure password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          className="text-base"
        />
        
        {/* Confirm Password Field */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={handleInputChange}
          error={errors?.confirmPassword}
          required
          className="text-base"
        />
      </div>

      {/* Submit Error */}
      {errors?.submit && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm font-medium">{errors?.submit}</span>
            <button
              type="button"
              onClick={() => navigator?.clipboard?.writeText(errors?.submit)}
              className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
            >
              Copy Error
            </button>
          </div>
        </div>
      )}

      {/* Stronger Call-to-Action Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-4 text-base shadow-lg"
      >
        {isLoading ? 'Creating Your Account...' : 'Create My Free Account'}
      </Button>

      {/* Reassurance under button */}
      <div className="text-center">
        <p className="text-sm text-gray-600 font-medium">
          Free and GDPR compliant – cancel anytime
        </p>
      </div>

      {/* Mini Trust Badges - Condensed row above the fold */}
      <div className="flex items-center justify-center gap-4 py-3 bg-gray-50/50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="Shield" size={10} className="text-green-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">GDPR</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon name="Award" size={10} className="text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">Legal Certified</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
            <Icon name="Lock" size={10} className="text-purple-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">Encryption</span>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon name="Users" size={10} className="text-orange-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">10,000+</span>
        </div>
      </div>

      {/* Checkboxes below signup button - Reduced visual weight */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <Checkbox
            label="I accept the Terms of Service"
            checked={agreements?.terms}
            onChange={(e) => handleAgreementChange('terms', e?.target?.checked)}
            error={errors?.terms}
            required
            className="text-sm"
          />

          <Checkbox
            label="I accept the Privacy Policy"
            checked={agreements?.privacy}
            onChange={(e) => handleAgreementChange('privacy', e?.target?.checked)}
            error={errors?.privacy}
            required
            className="text-sm"
          />

          <Checkbox
            label="Send me helpful legal tips via email (optional)"
            checked={agreements?.marketing}
            onChange={(e) => handleAgreementChange('marketing', e?.target?.checked)}
            className="text-sm text-gray-600"
          />
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;