import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeCard = ({ isNewUser = true }) => {
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    navigate('/ai-chat-interface');
  };

  if (isNewUser) {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <img
            src="/No background Logo.png"
            alt="BeReady logo"
            className="w-full h-full object-contain"
          />
        </div>

        
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Welcome to BeReady
        </h2>
        
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get instant, clear legal guidance on your housing, tenancy, and consumer rights. 
          No legal jargon, just plain English answers you can understand and act on.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="default"
            size="lg"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={handleAskQuestion}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Ask Your First Question
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            iconName="BookOpen"
            iconPosition="left"
            onClick={() => navigate('/rights-guides')}
          >
            Browse Rights Guides
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={16} />
            <span className="font-medium">UK Jurisdiction</span>
            <span>•</span>
            <span>Guidance based on UK law</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Good afternoon!</h2>
          <p className="text-muted-foreground">Ready to get some legal guidance?</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <Icon name="Sparkles" size={24} color="white" />
        </div>
      </div>
      
      <Button
        variant="default"
        iconName="Plus"
        iconPosition="left"
        onClick={handleAskQuestion}
        className="w-full sm:w-auto"
      >
        Ask a New Question
      </Button>
    </div>
  );
};

export default WelcomeCard;