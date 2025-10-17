import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GuideCard = ({ guide, onStartChat }) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (onStartChat) {
      onStartChat(guide?.title);
    }
    navigate('/ai-chat-interface', { 
      state: { 
        initialMessage: `I need help with ${guide?.title?.toLowerCase()}. Can you provide guidance?` 
      } 
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-modal transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg ${guide?.iconBg} flex items-center justify-center`}>
            <Icon name={guide?.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {guide?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {guide?.category}
            </p>
          </div>
        </div>
        {guide?.isNew && (
          <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
            New
          </span>
        )}
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {guide?.description}
      </p>
      {/* Key Topics */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Key Topics:</h4>
        <div className="flex flex-wrap gap-2">
          {guide?.keyTopics?.slice(0, 3)?.map((topic, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
            >
              {topic}
            </span>
          ))}
          {guide?.keyTopics?.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              +{guide?.keyTopics?.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="Clock" size={14} />
            {guide?.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="BookOpen" size={14} />
            {guide?.sections} sections
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartChat}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
          >
            Ask AI
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
            iconSize={16}
          >
            Read Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;