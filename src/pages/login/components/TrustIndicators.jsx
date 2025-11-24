import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'UK Legal Compliance',
      description: 'Fully compliant with UK legal standards'
    },
    {
      icon: 'Lock',
      title: 'Secure & Private',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: 'Award',
      title: 'Trusted by 10,000+ Users',
      description: 'Join thousands of UK residents getting legal guidance'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main trust message */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
          <Icon name="MapPin" size={16} className="text-success" />
          <span className="text-sm font-medium text-success ">UK Jurisdiction Only</span>
        </div>
      </div>
      {/* Trust badges */}
      <div className="grid grid-cols-1 gap-4">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name={badge?.icon} size={20} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">{badge?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Security notice */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-foreground">
              <strong>Your Privacy Matters:</strong> We use industry-standard encryption to protect your personal information and legal queries. Your data is never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;