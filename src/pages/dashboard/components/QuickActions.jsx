import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'ask-ai',
      title: 'Ask AI Assistant',
      description: 'Get instant legal guidance on any UK law question',
      icon: 'Bot',
      color: 'from-primary to-secondary',
      action: () => navigate('/ai-chat-interface'),
      primary: true
    },
    {
      id: 'browse-guides',
      title: 'Browse Rights Guides',
      description: 'Explore comprehensive guides on UK legal topics',
      icon: 'BookOpen',
      color: 'from-accent to-violet-600',
      action: () => navigate('/rights-guides'),
      primary: false
    },
    {
      id: 'view-journal',
      title: 'My Rights Journal',
      description: 'Access your saved questions and answers',
      icon: 'Notebook',
      color: 'from-secondary to-teal-600',
      action: () => navigate('/rights-journal'),
      primary: false
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Get started with these common tasks
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className={`
              relative group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200
              ${action?.primary 
                ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-card' 
                : 'border-border bg-muted/30 hover:bg-muted/50 hover:shadow-card'
              }
            `}
            onClick={action?.action}
          >
            <div className="p-5">
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${action?.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon name={action?.icon} size={24} color="white" />
              </div>

              {/* Content */}
              <h4 className={`text-base font-semibold mb-2 transition-colors ${
                action?.primary 
                  ? 'text-foreground group-hover:text-primary' 
                  : 'text-foreground group-hover:text-accent'
              }`}>
                {action?.title}
              </h4>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {action?.description}
              </p>

              {/* Action indicator */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${
                  action?.primary ? 'text-primary' : 'text-accent'
                }`}>
                  {action?.primary ? 'Get Started' : 'Explore'}
                </span>
                <Icon 
                  name="ArrowRight" 
                  size={16} 
                  className={`transition-transform group-hover:translate-x-1 ${
                    action?.primary ? 'text-primary' : 'text-accent'
                  }`}
                />
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className={`
              absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
              ${action?.primary 
                ? 'bg-gradient-to-br from-primary/5 to-secondary/5' :'bg-gradient-to-br from-accent/5 to-violet-600/5'
              }
            `} />
          </div>
        ))}
      </div>
      {/* Emergency Legal Help Notice */}
      <div className="mt-6 p-4 bg-warning/5 border border-warning/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Need urgent legal help?
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              For immediate legal emergencies, contact a qualified solicitor or legal aid service.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-warning/20 text-warning hover:bg-warning/10"
            >
              Find Legal Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;