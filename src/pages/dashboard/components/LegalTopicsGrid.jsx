import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LegalTopicsGrid = () => {
  const navigate = useNavigate();

  const legalTopics = [
    {
      id: 'housing',
      title: 'Housing & Tenancy Rights',
      description: 'Deposits, repairs, evictions, landlord obligations, and tenant protections under UK law.',
      icon: 'Home',
      color: 'from-blue-500 to-cyan-500',
      stats: '12 guides available',
      commonQuestions: [
        'Can my landlord keep my deposit?',
        'What repairs is my landlord responsible for?',
        'How much notice for eviction?'
      ]
    },
    {
      id: 'consumer',
      title: 'Consumer Rights',
      description: 'Refunds, faulty goods, online purchases, unfair contracts, and consumer protection.',
      icon: 'ShoppingCart',
      color: 'from-emerald-500 to-teal-500',
      stats: '8 guides available',
      commonQuestions: [
        'Can I return faulty online purchases?',
        'What are my refund rights?',
        'How to cancel unfair contracts?'
      ]
    },
    {
      id: 'contracts',
      title: 'Contract Explanations',
      description: 'Understanding everyday agreements, terms & conditions, and legal obligations.',
      icon: 'FileText',
      color: 'from-violet-500 to-purple-500',
      stats: '6 guides available',
      commonQuestions: [
        'What does this contract clause mean?',
        'Can I cancel this agreement?',
        'Are these terms fair?'
      ]
    }
  ];

  const handleTopicClick = (topicId) => {
    // Navigate to rights guides with topic filter
    navigate('/rights-guides', { state: { selectedTopic: topicId } });
  };

  const handleAskQuestion = (topic) => {
    // Navigate to AI chat with topic context
    navigate('/ai-chat-interface', { 
      state: { 
        suggestedTopic: topic?.title,
        suggestedQuestions: topic?.commonQuestions 
      } 
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Legal Topics</h3>
          <p className="text-sm text-muted-foreground">
            Explore your rights across different areas of UK law
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="ArrowRight"
          iconPosition="right"
          onClick={() => navigate('/rights-guides')}
        >
          View All Guides
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {legalTopics?.map((topic) => (
          <div
            key={topic?.id}
            className="group bg-gradient-to-br from-muted/30 to-muted/10 border border-border rounded-lg p-5 hover:shadow-card transition-all duration-200 cursor-pointer"
            onClick={() => handleTopicClick(topic?.id)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${topic?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={topic?.icon} size={24} color="white" />
              </div>
              <Icon 
                name="ArrowUpRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-foreground transition-colors" 
              />
            </div>

            {/* Content */}
            <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {topic?.title}
            </h4>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {topic?.description}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-2 mb-4">
              <Icon name="BookOpen" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{topic?.stats}</span>
            </div>

            {/* Common Questions Preview */}
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Common questions:</p>
              <ul className="space-y-1">
                {topic?.commonQuestions?.slice(0, 2)?.map((question, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-primary mt-1">•</span>
                    <span className="line-clamp-1">{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleTopicClick(topic?.id);
                }}
              >
                Read Guides
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 text-xs"
                onClick={(e) => {
                  e?.stopPropagation();
                  handleAskQuestion(topic);
                }}
              >
                Ask AI
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* UK Jurisdiction Notice */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="font-medium text-primary">UK Jurisdiction</span>
          <span className="text-muted-foreground">
            All guidance is based on current UK law and regulations
          </span>
        </div>
      </div>
    </div>
  );
};

export default LegalTopicsGrid;