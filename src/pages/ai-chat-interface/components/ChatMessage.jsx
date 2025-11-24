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
      minute: '2-digit',
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

  /* USER MESSAGE ------------------------------------------------------------------ */

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 px-3 sm:px-0">
        <div className="max-w-[85%] sm:max-w-3xl">
          <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2 sm:px-4 sm:py-3 shadow-card break-words">
            <p className="text-sm leading-relaxed">{message?.content}</p>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-muted-foreground">
              {formatTimestamp(message?.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ERROR MESSAGE ------------------------------------------------------------------ */

  if (isError) {
    return (
      <div className="flex justify-start mb-4 px-3 sm:px-0">
        <div className="max-w-[90%] sm:max-w-4xl w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
              <Icon name="AlertTriangle" size={14} color="white" />
            </div>
            <span className="text-sm font-medium text-red-400">Error</span>
          </div>

          <div className="bg-red-950/50 border border-red-700/70 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 break-words">
            <p className="text-sm text-red-100 mb-1 font-medium">
              {message?.error === 'network_error'
                ? 'Connection error'
                : message?.error === 'invalid_output'
                ? 'Response error'
                : 'System error'}
            </p>
            <p className="text-sm text-red-100/90">
              {message?.message || 'An unexpected error occurred.'}
            </p>
          </div>

          <div className="flex justify-start mt-1">
            <span className="text-[11px] text-slate-400">
              {formatTimestamp(message?.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* AI MESSAGE --------------------------------------------------------------------- */

  if (isAI) {
    const hasSteps = message?.stepByStepPlan && message.stepByStepPlan.length > 0;
    const hasRisks = message?.risksOrDeadlines && message.risksOrDeadlines.length > 0;
    const hasSolicitor = !!message?.whenToSeekSolicitor;
    const hasCitations = message?.citations && message.citations.length > 0;

    return (
      <div className="flex justify-start mb-4 px-3 sm:px-0">
        {/* NOTE: no w-full here, just max-w so it hugs the left */}
        <div className="max-w-[95%] sm:max-w-3xl flex items-start gap-2 sm:gap-3">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Scale" size={14} color="white" />
          </div>

          <div className="flex-1">
            {/* Name + status */}
            <div className="mb-1">
              <span className="text-xs sm:text-sm font-medium text-white">
                BreakinLaw Legal Assistant
              </span>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 text-[11px] sm:text-xs text-slate-300">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>{message?.jurisdiction || 'UK'} law</span>
                {message?.confidence && (
                  <span className="text-slate-400">
                    • {Math.round(message?.confidence * 100)}% confident
                  </span>
                )}
              </div>
            </div>

            {/* Bubble */}
            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-3 py-2 sm:px-4 sm:py-3 shadow-md text-sm text-slate-50 space-y-3 break-words">
              {/* Very short notice */}
              <p className="text-[11px] text-teal-200/80 flex items-center gap-1">
                <Icon name="AlertTriangle" size={11} className="text-teal-300" />
                UK legal information only, not legal advice.
              </p>

              {/* Quick Answer */}
              {message?.shortAnswer && (
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">Quick answer</p>
                  <p className="leading-relaxed">{message.shortAnswer}</p>
                </div>
              )}

              {/* What to do next */}
              {hasSteps && (
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">
                    What you can do next
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    {message.stepByStepPlan.map((step, index) => (
                      <li key={index} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Risks & deadlines */}
              {hasRisks && (
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">
                    Risks & deadlines
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    {message.risksOrDeadlines.map((risk, index) => (
                      <li key={index} className="leading-relaxed">
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to seek solicitor */}
              {hasSolicitor && (
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">
                    When to seek legal advisors
                  </p>
                  <p className="leading-relaxed">
                    {message.whenToSeekSolicitor}
                  </p>
                </div>
              )}

              {/* Sources */}
              {hasCitations && (
                <div>
                  <p className="font-semibold text-xs sm:text-sm mb-1">Sources</p>
                  <ul className="space-y-1 text-[11px] sm:text-xs">
                    {message.citations.map((citation, index) => (
                      <li key={index} className="leading-snug">
                        <span className="font-medium">{citation.title}</span>
                        {citation.last_updated && (
                          <span className="text-slate-400"> • {citation.last_updated}</span>
                        )}
                        {citation.url && (
                          <>
                            {' '}
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-300 hover:text-teal-200 underline"
                            >
                              Open
                            </a>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tiny disclaimer line */}
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This is general guidance only. For specific cases, speak to a qualified UK
                solicitor or barrister.
              </p>
            </div>

            {/* Footer: time + actions */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-slate-400">
                {formatTimestamp(message?.timestamp)}
              </span>

              <div className="flex items-center gap-3">
                {/* Feedback */}
                {message?.qaEventId && !feedbackSubmitted && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleFeedbackClick('up')}
                      className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
                    >
                      <Icon name="ThumbsUp" size={11} />
                      <span>Helpful</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedbackClick('down')}
                      className="flex items-center gap-1 text-rose-300 hover:text-rose-200"
                    >
                      <Icon name="ThumbsDown" size={11} />
                      <span>Not</span>
                    </button>
                  </div>
                )}
                {feedbackSubmitted && (
                  <span className="text-[11px] text-emerald-300">
                    ✓ Thanks for your feedback
                  </span>
                )}

                {/* Save / Export */}
                <div className="flex items-center gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onSaveToJournal(message)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    <Icon name="BookOpen" size={11} />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onExportPDF(message)}
                    className="flex items-center gap-1 text-slate-300 hover:text-white"
                  >
                    <Icon name="Download" size={11} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback note input */}
            {showNoteInput && (
              <div className="mt-2">
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e?.target?.value)}
                  placeholder="Tell us what could be improved..."
                  className="w-full p-2 text-[11px] border border-white/15 bg-black/40 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    className="text-[11px] text-slate-300 hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleFeedbackClick('down')}
                    className="text-[11px]"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* TYPING INDICATOR -------------------------------------------------------------- */

  if (message?.type === 'typing') {
    return (
      <div className="flex justify-start mb-4 px-3 sm:px-0">
        <div className="max-w-[95%] sm:max-w-3xl flex items-start gap-2 sm:gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Scale" size={14} color="white" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-md px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
              <span className="text-sm text-slate-200">
                Analyzing your legal query...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatMessage;
