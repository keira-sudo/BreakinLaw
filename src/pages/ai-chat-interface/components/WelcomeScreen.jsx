import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeScreen = ({ onStartChat }) => {
  const suggestedQuestions = [
    {
      id: 1,
      category: "Housing Rights",
      icon: "Home",
      question: "My landlord wants to increase my rent by 30%. Is this legal in the UK?",
      description: "Understanding UK rent increase regulations"
    },
    {
      id: 2,
      category: "Tenancy Issues",
      icon: "Key",
      question: "My landlord won't return my deposit. What can I do under UK law?",
      description: "UK deposit protection and recovery"
    },
    {
      id: 3,
      category: "Consumer Rights",
      icon: "ShoppingCart",
      question: "I bought a faulty product online. Can I get a refund under UK consumer law?",
      description: "UK online purchase rights and returns"
    },
    {
      id: 4,
      category: "Repairs & Maintenance",
      icon: "Wrench",
      question: "My heating hasn\'t worked for weeks. What are my rights under UK law?",
      description: "UK landlord repair obligations"
    },
    {
      id: 5,
      category: "Eviction Notice",
      icon: "AlertTriangle",
      question: "I received a Section 21 notice. What does this mean under UK law?",
      description: "Understanding UK eviction procedures"
    },
    {
      id: 6,
      category: "Contract Issues",
      icon: "FileText",
      question: "I signed a contract but want to cancel. Is this possible under UK law?",
      description: "UK contract cancellation rights"
    }
  ];

  const trustSignals = [
    {
      icon: "Shield",
      title: "UK Legal Compliance",
      description: "Guidance based on current UK law"
    },
    {
      icon: "Database",
      title: "RAG-Powered Responses",
      description: "Answers based on verified UK legal documents"
    },
    {
      icon: "BookOpen",
      title: "Save & Export",
      description: "Keep records of all guidance"
    },
    {
      icon: "Users",
      title: "Professional Network",
      description: "Connect with qualified UK solicitors"
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-2xl from-primary to-secondary flex items-center justify-center mx-auto mb-">
            <img src="/no background b2c.png" alt="logo" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome to BreakinLaw
          </h1>
          
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trustSignals?.map((signal, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon name={signal?.icon} size={20} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {signal?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {signal?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Ask your first question
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedQuestions?.map((item) => (
              <button
                key={item?.id}
                onClick={() => onStartChat(item?.question)}
                className="bg-card border border-border rounded-lg p-4 text-left hover:border-primary/50 hover:shadow-card transition-all duration-200 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon name={item?.icon} size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {item?.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1 leading-relaxed">
                      {item?.question}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item?.description}
                    </p>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* UK Jurisdiction Notice */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <Icon name="MapPin" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2">
                UK Legal Jurisdiction
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                All guidance provided is specific to UK law and regulations. This includes England, Wales, Scotland, and Northern Ireland, 
                with appropriate regional variations noted where applicable.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Important Legal Notice</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            This AI assistant provides general legal information for educational purposes only and does not constitute legal advice. 
            For specific legal matters or complex situations, please consult with a qualified UK solicitor or barrister. 
            BeReady is not responsible for any actions taken based on this guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;