import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (message?.trim() || attachedFile) {
      onSendMessage({
        content: message?.trim(),
        attachment: attachedFile
      });
      setMessage('');
      setAttachedFile(null);
      if (textareaRef?.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e?.target?.value);
    
    // Auto-resize textarea
    const textarea = e?.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea?.scrollHeight, 120) + 'px';
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes?.includes(file?.type)) {
        alert('Please select a PDF, image, or text file.');
        return;
      }

      if (file?.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
      }

      setAttachedFile({
        name: file?.name,
        size: file?.size,
        type: file?.type,
        file: file
      });
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef?.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return 'FileText';
    if (type?.includes('image')) return 'Image';
    return 'File';
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Attachment Preview */}
      {attachedFile && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
            <Icon name={getFileIcon(attachedFile?.type)} size={20} className="text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {attachedFile?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachedFile?.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeAttachment}
              className="h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      )}
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-3">
          {/* File Attachment Button */}
          <div className="flex-shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef?.current?.click()}
              disabled={disabled}
              className="h-10 w-10"
            >
              <Icon name="Paperclip" size={20} />
            </Button>
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your housing, tenancy, or consumer rights in plain English..."
              disabled={disabled}
              className="w-full min-h-[44px] max-h-[120px] px-4 py-3 pr-12 text-sm bg-background border border-border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground"
              rows={1}
            />
            
            {/* Character count */}
            <div className="absolute bottom-1 right-12 text-xs text-muted-foreground">
              {message?.length}/1000
            </div>
          </div>

          {/* Send Button */}
          <div className="flex-shrink-0">
            <Button
              type="submit"
              variant="default"
              size="icon"
              disabled={disabled || (!message?.trim() && !attachedFile)}
              className="h-10 w-10 rounded-full"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>•</span>
            <span>Max 1000 characters</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Shield" size={12} />
            <span>UK Legal Guidance</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;