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
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gradient">BreakinLaw</h1>
            <p className="text-sm text-muted-foreground"> </p>
          </div>
        </div>
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