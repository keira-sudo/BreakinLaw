import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatMessage = ({ message, onSaveToJournal, onExportPDF, onFeedback }) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [feedbackNote, setFeedbackNote] = useState('');

  const isUser = message?.type === 'user';
  const isAI = message?.type === 'ai';
  const isError = message?.type === 'error';

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFeedbackClick = async (rating) => {
    if (!message?.qaEventId) {
      alert('Unable to submit feedback: Event ID missing');
      return;
    }

    if (rating === 'down' && !showNoteInput) {
      setShowNoteInput(true);
      return;
    }

    try {
      await onFeedback?.(message?.qaEventId, rating, feedbackNote || null);
      setFeedbackSubmitted(true);
      setShowNoteInput(false);
      setFeedbackNote('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-3xl">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 shadow-card">
            <p className="text-sm leading-relaxed">{message?.content}</p>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message?.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-4xl w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-red-600">Error</span>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-2xl rounded-tl-md p-4">
            <p className="text-sm text-red-800 mb-2 font-medium">
              {message?.error === 'network_error' ? 'Connection Error' : 
               message?.error === 'invalid_output'? 'Response Error' : 'System Error'}
            </p>
            <p className="text-sm text-red-700">
              {message?.message || 'An unexpected error occurred.'}
            </p>
          </div>
          
          <div className="flex justify-start mt-1">
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message?.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (isAI) {
    return (
      <div className="flex justify-start mb-8">
        <div className="max-w-4xl w-full">
          {/* AI Avatar and Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Scale" size={16} color="white" />
            </div>
            <div>
              <span className="text-sm font-medium text-foreground">BeReady Legal Assistant</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-xs text-muted-foreground">
                  {message?.jurisdiction || 'UK'} Jurisdiction
                </span>
                {message?.confidence && (
                  <span className="text-xs text-muted-foreground">
                    • {Math.round(message?.confidence * 100)}% confident
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AI Response Content */}
          <div className="bg-card border border-border rounded-2xl rounded-tl-md shadow-card overflow-hidden">
            {/* UK Legal Notice Banner */}
            <div className="bg-primary/5 border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={14} className="text-warning flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Information for UK law. Not legal advice.</span>
              </div>
            </div>

            {/* Response Content */}
            <div className="p-4 space-y-4">
              {/* Short Answer */}
              {message?.shortAnswer && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} className="text-primary" />
                    Quick Answer
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed bg-muted/30 rounded-lg p-3">
                    {message?.shortAnswer}
                  </p>
                </div>
              )}

              {/* Step-by-Step Plan */}
              {message?.stepByStepPlan && message?.stepByStepPlan?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="ListChecks" size={16} className="text-primary" />
                    What to do next
                  </h4>
                  <div className="space-y-3">
                    {message?.stepByStepPlan?.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risks & Deadlines */}
              {message?.risksOrDeadlines && message?.risksOrDeadlines?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="Clock" size={16} className="text-warning" />
                    Risks & deadlines
                  </h4>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                    <ul className="space-y-2">
                      {message?.risksOrDeadlines?.map((risk, index) => (
                        <li key={index} className="flex gap-2 text-sm text-foreground">
                          <Icon name="AlertTriangle" size={14} className="text-warning flex-shrink-0 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* When to Seek a Solicitor */}
              {message?.whenToSeekSolicitor && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="UserCheck" size={16} className="text-secondary" />
                    When to seek legal advisors
                  </h4>
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                    <p className="text-sm text-foreground leading-relaxed">
                      {message?.whenToSeekSolicitor}
                    </p>
                  </div>
                </div>
              )}

              {/* Citations */}
              {message?.citations && message?.citations?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Icon name="ExternalLink" size={16} className="text-primary" />
                    Sources
                  </h4>
                  <div className="space-y-2">
                    {message?.citations?.map((citation, index) => (
                      <div key={index} className="border border-border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-medium text-foreground truncate">
                              {citation?.title}
                            </h5>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last updated: {citation?.last_updated}
                            </p>
                          </div>
                          {citation?.url && (
                            <a
                              href={citation?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 flex-shrink-0"
                            >
                              <Icon name="ExternalLink" size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-muted/30 border-t border-border px-4 py-3">
              <div className="flex items-start gap-2">
                <Icon name="AlertTriangle" size={14} className="text-warning flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>Legal Disclaimer:</strong> This guidance is for informational purposes only and does not constitute legal advice. 
                  For specific legal matters, please consult with a qualified UK solicitor or barrister.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(message?.timestamp)}
                </span>
                
                <div className="flex items-center gap-2">
                  {/* Feedback Buttons */}
                  {!feedbackSubmitted && message?.qaEventId ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ThumbsUp"
                        iconPosition="left"
                        iconSize={14}
                        onClick={() => handleFeedbackClick('up')}
                        className="text-xs text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ThumbsDown"
                        iconPosition="left"
                        iconSize={14}
                        onClick={() => handleFeedbackClick('down')}
                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Not helpful
                      </Button>
                    </div>
                  ) : feedbackSubmitted ? (
                    <span className="text-xs text-green-600">✓ Thank you for your feedback</span>
                  ) : null}

                  {/* Other Actions */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="BookOpen"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => onSaveToJournal(message)}
                    className="text-xs"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    iconSize={14}
                    onClick={() => onExportPDF(message)}
                    className="text-xs"
                  >
                    Export
                  </Button>
                </div>
              </div>

              {/* Feedback Note Input */}
              {showNoteInput && (
                <div className="mt-3 pt-3 border-t border-border">
                  <textarea
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e?.target?.value)}
                    placeholder="Please tell us what could be improved..."
                    className="w-full p-2 text-xs border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNoteInput(false);
                        setFeedbackNote('');
                      }}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleFeedbackClick('down')}
                      className="text-xs"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Typing indicator
  if (message?.type === 'typing') {
    return (
      <div className="flex justify-start mb-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Scale" size={16} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">BeReady Legal Assistant</span>
          </div>
          <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 shadow-card">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-muted-foreground">Analyzing your legal query...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessage;