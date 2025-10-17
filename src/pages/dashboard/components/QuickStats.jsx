import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ hasActivity = false }) => {
  const navigate = useNavigate();

  // Mock stats data
  const stats = hasActivity ? [
    {
      id: 'questions',
      label: 'Questions Asked',
      value: '12',
      change: '+3 this week',
      icon: 'MessageCircle',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: 'up'
    },
    {
      id: 'saved',
      label: 'Answers Saved',
      value: '8',
      change: '+2 this week',
      icon: 'Bookmark',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: 'up'
    },
    {
      id: 'guides',
      label: 'Guides Read',
      value: '5',
      change: '+1 this week',
      icon: 'BookOpen',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: 'up'
    },
    {
      id: 'streak',
      label: 'Day Streak',
      value: '7',
      change: 'Keep it up!',
      icon: 'Flame',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      trend: 'neutral'
    }
  ] : [
    {
      id: 'questions',
      label: 'Questions Asked',
      value: '0',
      change: 'Start your journey',
      icon: 'MessageCircle',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
      trend: 'neutral'
    },
    {
      id: 'guides',
      label: 'Available Guides',
      value: '26',
      change: 'Ready to explore',
      icon: 'BookOpen',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: 'neutral'
    },
    {
      id: 'topics',
      label: 'Legal Topics',
      value: '3',
      change: 'Housing, Consumer, Contracts',
      icon: 'Scale',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      trend: 'neutral'
    },
    {
      id: 'support',
      label: '24/7 Available',
      value: 'AI',
      change: 'Always here to help',
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      trend: 'neutral'
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const handleStatClick = (statId) => {
    switch (statId) {
      case 'questions': navigate('/ai-chat-interface');
        break;
      case 'saved': case'streak': navigate('/rights-journal');
        break;
      case 'guides': case'topics': navigate('/rights-guides');
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-all duration-200 cursor-pointer group"
          onClick={() => handleStatClick(stat?.id)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon 
                name={stat?.icon} 
                size={20} 
                className={stat?.color}
              />
            </div>
            {stat?.trend !== 'neutral' && (
              <Icon 
                name={getTrendIcon(stat?.trend)} 
                size={16} 
                className={stat?.trend === 'up' ? 'text-success' : 'text-error'}
              />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {stat?.value}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              {stat?.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat?.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;