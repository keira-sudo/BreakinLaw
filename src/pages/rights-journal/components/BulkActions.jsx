import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedEntries, 
  onSelectAll, 
  onClearSelection, 
  onBulkExport, 
  onBulkDelete,
  totalEntries 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleBulkExport = async () => {
    setIsExporting(true);
    try {
      await onBulkExport(selectedEntries);
    } finally {
      setIsExporting(false);
    }
  };

  const allSelected = selectedEntries?.length === totalEntries && totalEntries > 0;

  if (selectedEntries?.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="CheckSquare" size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {selectedEntries?.length} of {totalEntries} selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={allSelected ? onClearSelection : onSelectAll}
              iconName={allSelected ? "Square" : "CheckSquare"}
              iconPosition="left"
              iconSize={14}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear Selection
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export Selected
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkDelete(selectedEntries)}
            iconName="Trash2"
            iconPosition="left"
            iconSize={14}
          >
            Delete Selected
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;