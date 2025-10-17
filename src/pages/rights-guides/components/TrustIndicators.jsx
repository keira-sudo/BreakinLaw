import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustIndicators = () => {
  const indicators = [
    {
      id: 'uk-law',
      icon: 'Scale',
      title: 'UK Law Compliant',
      description: 'All guidance based on current UK legislation'
    },
    {
      id: 'verified',
      icon: 'Shield',
      title: 'Legally Verified',
      description: 'Content reviewed by qualified UK solicitors'
    },
    {
      id: 'updated',
      icon: 'RefreshCw',
      title: 'Regularly Updated',
      description: 'Content updated to reflect latest legal changes'
    },
    {
      id: 'jurisdiction',
      icon: 'MapPin',
      title: 'UK Jurisdiction Only',
      description: 'Specifically for England, Wales, Scotland & N. Ireland'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Award" size={20} className="text-success" />
        <h2 className="text-lg font-semibold text-foreground">Trust & Compliance</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators?.map((indicator) => (
          <div key={indicator?.id} className="text-center">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Icon name={indicator?.icon} size={24} className="text-success" />
            </div>
            <h3 className="font-medium text-foreground text-sm mb-1">
              {indicator?.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {indicator?.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Icon name="Info" size={14} />
          <span>
            This guidance is for informational purposes only and does not constitute legal advice. 
            For specific legal matters, please consult with a qualified UK solicitor.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;