import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatHeader = ({ onNewChat, onClearChat, messageCount = 0 }) => {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - AI Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon name="Scale" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              BeReady Legal Assistant
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                Online • UK Jurisdiction
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Message Counter */}
          {messageCount > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-full">
              <Icon name="MessageSquare" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {messageCount} message{messageCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Clear Chat Button */}
          {messageCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
              onClick={onClearChat}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              <span className="hidden sm:inline">Clear Chat</span>
            </Button>
          )}

          {/* New Chat Button */}
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={14}
            onClick={onNewChat}
            className="text-xs"
          >
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      {messageCount > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={12} />
                <span>Session started {new Date()?.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Shield" size={12} />
                <span>Secure & Private</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={12} />
              <span>UK Law Applied</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;