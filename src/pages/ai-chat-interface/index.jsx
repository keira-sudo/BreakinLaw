import React, { useState, useEffect, useRef } from 'react';

import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHeader from './components/ChatHeader';

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const API_BASE = '/api/legal-queries';

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageData) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageData?.content,
      attachment: messageData?.attachment,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const typingMessage = {
      id: Date.now() + 1,
      type: 'typing',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          question: messageData?.content,
        }),
      });

      const responseText = await response?.text();

      setMessages((prev) => prev?.filter((msg) => msg?.type !== 'typing'));

      if (!response?.ok) {
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : null;
        } catch {
          if (
            responseText?.toLowerCase()?.includes('<!doctype html>') ||
            responseText?.toLowerCase()?.includes('<html')
          ) {
            throw new Error(
              'Backend server not available. Please ensure the backend is running.'
            );
          }
          throw new Error(`Server error: ${response?.status} ${response?.statusText}`);
        }

        const errorMessage = {
          id: Date.now() + 2,
          type: 'error',
          error: errorData?.error || 'server_error',
          message: errorData?.message || `Server error: ${response?.status}`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      let data;
      try {
        if (!responseText) {
          throw new Error('Empty response from server');
        }

        const trimmed = responseText.trim();
        if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
          if (
            trimmed.toLowerCase().includes('<!doctype html>') ||
            trimmed.toLowerCase().includes('<html')
          ) {
            throw new Error('Backend server not available.');
          }
          throw new Error('Server returned non-JSON response');
        }

        data = JSON.parse(responseText);
      } catch (parseError) {
        let msg = 'Unable to parse server response. ';
        if (
          responseText?.toLowerCase()?.includes('<!doctype html>') ||
          responseText?.toLowerCase()?.includes('<html')
        ) {
          msg += 'Backend server is not running.';
        } else if (!responseText) {
          msg += 'Server returned empty response.';
        } else {
          msg += 'Server may be experiencing issues. Please try again.';
        }

        const errorMessageObj = {
          id: Date.now() + 2,
          type: 'error',
          error: 'parse_error',
          message: msg,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessageObj]);
        return;
      }

      if (!data || typeof data !== 'object') {
        const errorMessage = {
          id: Date.now() + 2,
          type: 'error',
          error: 'invalid_response',
          message: 'Server returned invalid response format. Please try again.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        return;
      }

      const aiMessage = {
        id: Date.now() + 2,
        type: 'ai',
        qaEventId: data?.metadata?.qa_event_id,
        jurisdiction: data?.answer?.jurisdiction,
        shortAnswer: data?.answer?.short_answer,
        stepByStepPlan: data?.answer?.step_by_step_plan,
        risksOrDeadlines: data?.answer?.risks_or_deadlines,
        whenToSeekSolicitor: data?.answer?.when_to_seek_a_solicitor,
        citations: data?.answer?.citations,
        confidence: data?.answer?.confidence,
        metadata: data?.metadata,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling API:', error);

      setMessages((prev) => prev?.filter((msg) => msg?.type !== 'typing'));

      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorType = 'network_error';

      if (error?.message?.includes('Backend server not available')) {
        errorMessage =
          'The AI service backend is not running. Please start it and try again.';
        errorType = 'service_unavailable';
      } else if (
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'NetworkError'
      ) {
        errorMessage =
          'Network connection error. Please check your internet connection.';
        errorType = 'network_error';
      } else if (
        error?.message?.includes('parse') ||
        error?.message?.includes('JSON')
      ) {
        errorMessage = 'Server response format error. Please try again later.';
        errorType = 'parse_error';
      }

      const errorMessageObj = {
        id: Date.now() + 2,
        type: 'error',
        error: errorType,
        message: errorMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = (question) => {
    handleSendMessage({ content: question });
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleClearChat = () => {
    if (
      window.confirm(
        'Are you sure you want to clear this chat? This action cannot be undone.'
      )
    ) {
      setMessages([]);
    }
  };

  const handleSaveToJournal = async (message) => {
    console.log('Saving to journal:', message);
    alert('Response saved to your Rights Journal. You can view it in My Journal.');
  };

  const handleExportPDF = (message) => {
    console.log('Exporting to PDF:', message);
    alert('PDF export coming soon. For now you can copy the text or save it to your journal.');
  };

  const handleFeedback = async (qaEventId, rating, note = null) => {
    try {
      const response = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: qaEventId,
          rating,
          note,
        }),
      });

      const data = await response?.json();

      if (!response?.ok) {
        console.error('Feedback API error:', data);
        alert(`Failed to submit feedback: ${data?.message || 'Please try again.'}`);
        return;
      }

      alert('Thank you for your feedback.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again later.');
    }
  };

  const hasMessages = messages?.length > 0;

  return (
    <div className="min-h-screen w-full bg-[#050821] text-white relative overflow-hidden">
      {/* Welcome hero, still absolute so it can fade over the page */}
      <div
        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-out
        ${hasMessages ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      >
        <WelcomeScreen onStartChat={handleStartChat} />
      </div>

      {/* Chat layer in normal flow so the page can scroll */}
      <div
        className={`transition-all duration-500 ease-out ${
          hasMessages
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="min-h-screen flex flex-col pt-16 pb-4">
          <div className="w-full max-w-4xl mx-auto px-4 flex-1 flex flex-col gap-4">
            {/* Header */}
            <ChatHeader
              onNewChat={handleNewChat}
              onClearChat={handleClearChat}
              messageCount={messages?.filter((msg) => msg?.type !== 'typing')?.length}
            />

            {/* Conversation card */}
            <div className="flex-1 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                              <div
                  ref={chatContainerRef}
                  className="px-4 py-6"
                >

                {messages?.map((message) => (
                  <ChatMessage
                    key={message?.id}
                    message={message}
                    onSaveToJournal={handleSaveToJournal}
                    onExportPDF={handleExportPDF}
                    onFeedback={handleFeedback}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Bottom input */}
          <div className="border-t border-white/10 bg-[#050821]/95 backdrop-blur mt-4">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
