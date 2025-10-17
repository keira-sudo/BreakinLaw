import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Icon name="Search" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No entries match your filters
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or clearing filters to see more results.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="X"
          iconPosition="left"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
        <Icon name="BookOpen" size={32} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        Your Rights Journal is Empty
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Start building your personal legal knowledge base by asking questions and saving the responses you find helpful.
      </p>
      
      <div className="space-y-4">
        <Button
          variant="default"
          onClick={() => navigate('/ai-chat-interface')}
          iconName="MessageCircle"
          iconPosition="left"
        >
          Ask Your First Question
        </Button>
        
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/rights-guides')}
            iconName="FileText"
            iconPosition="left"
          >
            Browse Rights Guides
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            iconName="LayoutDashboard"
            iconPosition="left"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon name="Save" size={20} className="text-blue-600" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Save Responses</h4>
          <p className="text-sm text-muted-foreground">
            Keep important legal guidance for future reference
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-50 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-green-600" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Export PDFs</h4>
          <p className="text-sm text-muted-foreground">
            Download your saved entries as professional documents
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-purple-50 rounded-lg flex items-center justify-center">
            <Icon name="FolderOpen" size={20} className="text-purple-600" />
          </div>
          <h4 className="font-medium text-foreground mb-1">Organize</h4>
          <p className="text-sm text-muted-foreground">
            Categorize and search through your legal knowledge
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;