import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'emergency',
      title: 'Emergency Legal Help',
      description: 'Urgent housing or tenancy issues requiring immediate attention',
      icon: 'AlertTriangle',
      iconBg: 'bg-destructive',
      action: () => navigate('/ai-chat-interface', { 
        state: { initialMessage: 'I have an urgent legal issue that needs immediate attention.' } 
      })
    },
    {
      id: 'chat',
      title: 'Ask AI Assistant',
      description: 'Get instant answers to your legal questions',
      icon: 'MessageCircle',
      iconBg: 'bg-primary',
      action: () => navigate('/ai-chat-interface')
    },
    {
      id: 'journal',
      title: 'My Saved Guides',
      description: 'Access your bookmarked guides and notes',
      icon: 'BookOpen',
      iconBg: 'bg-secondary',
      action: () => navigate('/rights-journal')
    }
  ];

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-all duration-200 cursor-pointer group"
            onClick={action?.action}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${action?.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                  {action?.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {action?.description}
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;