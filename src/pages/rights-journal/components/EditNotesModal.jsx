import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EditNotesModal = ({ entry, isOpen, onClose, onSave }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setNotes(entry?.personalNotes || '');
    }
  }, [entry]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(entry?.id, notes);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNotes(entry?.personalNotes || '');
    onClose();
  };

  if (!isOpen || !entry) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-150"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-floating w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Edit Personal Notes</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add your thoughts, reminders, or additional context
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              aria-label="Close modal"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Entry Preview */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {entry?.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.savedAt)?.toLocaleDateString('en-GB')}
                </span>
              </div>
              <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                {entry?.query}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {entry?.shortAnswer}
              </p>
            </div>

            {/* Notes Input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Personal Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e?.target?.value)}
                placeholder="Add your thoughts, reminders, or additional context about this legal guidance..."
                className="w-full h-32 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Use this space to record your personal thoughts, action items, or related experiences.
                </p>
                <span className="text-xs text-muted-foreground">
                  {notes?.length}/1000
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Note-taking Tips</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Record specific dates and deadlines mentioned</li>
                    <li>• Note any documents you need to gather</li>
                    <li>• Add reminders for follow-up actions</li>
                    <li>• Include contact details for relevant organizations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditNotesModal;