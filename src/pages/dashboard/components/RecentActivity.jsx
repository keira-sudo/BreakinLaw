import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ hasActivity = false }) => {
  const navigate = useNavigate();

  // Mock recent activity data
  const recentQueries = [
    {
      id: 1,
      question: "Can my landlord enter my property without permission?",
      category: "Housing Rights",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: "answered"
    },
    {
      id: 2,
      question: "What are my rights if I receive faulty goods online?",
      category: "Consumer Rights",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: "saved"
    },
    {
      id: 3,
      question: "How much notice does my landlord need to give for rent increase?",
      category: "Tenancy Rights",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: "answered"
    }
  ];

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Housing Rights':
        return 'Home';
      case 'Consumer Rights':
        return 'ShoppingCart';
      case 'Tenancy Rights':
        return 'Key';
      default:
        return 'FileText';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'text-success';
      case 'saved':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!hasActivity) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">No recent activity yet</p>
          <p className="text-sm text-muted-foreground">
            Your questions and saved answers will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/rights-journal')}
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {recentQueries?.map((query) => (
          <div
            key={query?.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => navigate('/ai-chat-interface')}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon 
                name={getCategoryIcon(query?.category)} 
                size={16} 
                className="text-primary" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {query?.question}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{query?.category}</span>
                <span>•</span>
                <span>{formatTimeAgo(query?.timestamp)}</span>
                <span className={`ml-auto ${getStatusColor(query?.status)}`}>
                  {query?.status === 'answered' ? 'Answered' : 'Saved'}
                </span>
              </div>
            </div>
            
            <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;