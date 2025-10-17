import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LoginHeader = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Icon name="Scale" size={28} color="white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gradient">BeReady</h1>
            <p className="text-sm text-muted-foreground">Legal Guidance for UK Residents</p>
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sign in to access your personal legal guidance account and continue getting the help you need with UK housing, tenancy, and consumer rights.
        </p>
      </div>

      {/* Register prompt */}
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Don't have an account?</span>
        <Button
          variant="link"
          size="sm"
          onClick={handleRegisterClick}
          className="p-0 h-auto font-semibold text-primary hover:text-primary/80"
        >
          Create one for free
        </Button>
      </div>
    </div>
  );
};

export default LoginHeader;