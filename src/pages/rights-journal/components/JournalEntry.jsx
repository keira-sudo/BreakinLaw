import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const JournalEntry = ({ entry, onView, onExport, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Housing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Tenancy': 'bg-green-100 text-green-800 border-green-200',
      'Consumer Rights': 'bg-purple-100 text-purple-800 border-purple-200',
      'Contracts': 'bg-orange-100 text-orange-800 border-orange-200',
      'General': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors?.[category] || colors?.['General'];
  };

  const truncateText = (text, maxLength = 150) => {
    if (text?.length <= maxLength) return text;
    return text?.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card hover:shadow-modal transition-all duration-200">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(entry?.category)}`}>
                {entry?.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(entry?.savedAt)}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
              {entry?.query}
            </h3>
            <p className="text-xs text-muted-foreground">
              {truncateText(entry?.shortAnswer)}
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'Collapse entry' : 'Expand entry'}
            >
              <Icon 
                name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                size={16} 
              />
            </Button>
          </div>
        </div>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* UK Jurisdiction Badge */}
          <div className="flex items-center gap-2 p-2 bg-primary/5 border border-primary/20 rounded-md">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">UK Jurisdiction</span>
          </div>

          {/* Four-part response structure */}
          <div className="space-y-3">
            {/* Short Answer */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Quick Answer</h4>
              <p className="text-sm text-muted-foreground">{entry?.shortAnswer}</p>
            </div>

            {/* Action Plan */}
            {entry?.actionPlan && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Step-by-Step Plan</h4>
                <div className="space-y-2">
                  {entry?.actionPlan?.map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary text-xs font-medium rounded-full flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consultation Guidance */}
            {entry?.consultationGuidance && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Professional Help</h4>
                <p className="text-sm text-muted-foreground">{entry?.consultationGuidance}</p>
              </div>
            )}
          </div>

          {/* Personal Notes */}
          {entry?.personalNotes && (
            <div className="p-3 bg-muted/50 rounded-md">
              <h4 className="text-sm font-semibold text-foreground mb-1">Your Notes</h4>
              <p className="text-sm text-muted-foreground">{entry?.personalNotes}</p>
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="p-3 bg-warning/5 border border-warning/20 rounded-md">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning">
                This guidance is for informational purposes only and does not constitute legal advice. 
                For specific legal matters, consult with a qualified UK solicitor.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(entry)}
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
            >
              View Full
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport(entry)}
              iconName="Download"
              iconPosition="left"
              iconSize={14}
            >
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry)}
              iconName="Edit"
              iconPosition="left"
              iconSize={14}
            >
              Edit Notes
            </Button>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry)}
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;