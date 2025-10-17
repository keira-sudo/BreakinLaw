import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedGuides = ({ onStartChat }) => {
  const navigate = useNavigate();

  const featuredGuides = [
    {
      id: 'tenant-deposit-protection',
      title: 'Tenant Deposit Protection',
      description: `Understanding your rights regarding deposit protection schemes, how to get your deposit back, and what to do if your landlord hasn't protected your deposit properly.`,category: 'Tenancy Rights',readTime: '8 min read',
      isPopular: true,
      tags: ['Deposits', 'TDP Schemes', 'End of Tenancy'],
      urgencyLevel: 'high'
    },
    {
      id: 'eviction-notice-rights',title: 'Eviction Notice Rights',
      description: `What to do when you receive an eviction notice, understanding Section 8 and Section 21 notices, and your rights during the eviction process.`,
      category: 'Housing Rights',readTime: '12 min read',
      isPopular: true,
      tags: ['Eviction', 'Section 21', 'Section 8'],
      urgencyLevel: 'high'
    },
    {
      id: 'faulty-goods-refunds',title: 'Faulty Goods & Refunds',description: `Your consumer rights when purchasing faulty goods, understanding the Consumer Rights Act 2015, and how to claim refunds or replacements.`,category: 'Consumer Rights',readTime: '6 min read',
      isPopular: true,
      tags: ['Refunds', 'Consumer Rights Act', 'Faulty Goods'],
      urgencyLevel: 'medium'
    }
  ];

  const handleStartChat = (guideTitle) => {
    if (onStartChat) {
      onStartChat(guideTitle);
    }
    navigate('/ai-chat-interface', { 
      state: { 
        initialMessage: `I need help with ${guideTitle?.toLowerCase()}. Can you provide detailed guidance?` 
      } 
    });
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="Star" size={20} className="text-warning" />
          <h2 className="text-xl font-semibold text-foreground">Featured Guides</h2>
          <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
            Most Helpful
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {featuredGuides?.map((guide) => (
          <div
            key={guide?.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-modal transition-all duration-200 group"
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {guide?.category}
                  </span>
                  {guide?.isPopular && (
                    <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(guide?.urgencyLevel)}`}>
                  {guide?.urgencyLevel === 'high' ? 'Urgent' : guide?.urgencyLevel === 'medium' ? 'Important' : 'General'}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                {guide?.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {guide?.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {guide?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon name="Clock" size={14} />
                  {guide?.readTime}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartChat(guide?.title)}
                    iconName="MessageCircle"
                    iconPosition="left"
                    iconSize={14}
                  >
                    Ask AI
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={14}
                  >
                    Read
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedGuides;