import React, { useState, useEffect, useRef } from 'react';

import Sidebar from '../../components/ui/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHeader from './components/ChatHeader';

const AIChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Centralize API base
  const API_BASE = '/api/legal-queries';

  // Auto-scroll to bottom when new messages arrive
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
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage = {
      id: Date.now() + 1,
      type: 'typing',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          question: messageData?.content
        }),
      });

      console.log('Response Status:', response?.status);
      console.log('Response Headers:', Object.fromEntries(response?.headers?.entries() || []));

      const responseText = await response?.text();
      console.log('Raw Response:', responseText?.substring(0, 200));

      // Remove typing indicator early
      setMessages(prev => prev?.filter(msg => msg?.type !== 'typing'));

      if (!response?.ok) {
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : null;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          console.error('Error response text:', responseText);

          if (responseText?.includes('<!DOCTYPE html>') || responseText?.includes('<html')) {
            throw new Error('Backend server not available. Please ensure the Express backend is running on port 3001.');
          }

          throw new Error(`Server error: ${response?.status} ${response?.statusText}`);
        }

        let errorMessage = {
          id: Date.now() + 2,
          type: 'error',
          error: errorData?.error || 'server_error',
          message: errorData?.message || `Server error: ${response?.status}`,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      let data;
      try {
        if (!responseText) {
          throw new Error('Empty response from server');
        }

        const trimmedResponse = responseText?.trim();
        if (!trimmedResponse?.startsWith('{') && !trimmedResponse?.startsWith('[')) {
          if (trimmedResponse?.toLowerCase()?.includes('<!doctype html>') ||
              trimmedResponse?.toLowerCase()?.includes('<html')) {
            console.error('Received HTML instead of JSON - Backend not available');
            throw new Error('Backend server not available. Please start the Express server on port 3001 or check your API proxy configuration.');
          }

          console.error('Response does not appear to be JSON:', trimmedResponse?.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing successful response:', parseError);
        console.error('Response text causing parse error:', responseText?.substring(0, 500));

        let errorMessage = 'Unable to parse server response. ';
        if (responseText?.includes('<!doctype html>') || responseText?.includes('<html')) {
          errorMessage += 'Backend server is not running. Please start the Express server with "cd backend && node server.js"';
        } else if (!responseText) {
          errorMessage += 'Server returned empty response.';
        } else {
          errorMessage += 'Server may be experiencing issues. Please try again.';
        }

        let errorMessageObj = {
          id: Date.now() + 2,
          type: 'error',
          error: 'parse_error',
          message: errorMessage,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessageObj]);
        return;
      }

      if (!data || typeof data !== 'object') {
        console.error('Invalid response structure:', data);

        let errorMessage = {
          id: Date.now() + 2,
          type: 'error',
          error: 'invalid_response',
          message: 'Server returned invalid response format. Please try again.',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, errorMessage]);
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
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error calling API:', error);

      setMessages(prev => prev?.filter(msg => msg?.type !== 'typing'));

      let errorMessage = 'An unexpected error occurred. Please try again.';
      let errorType = 'network_error';

      if (error?.message?.includes('Backend server not available') || error?.message?.includes('Backend not available')) {
        errorMessage = 'The AI service backend is not running. Please start the backend server and try again.';
        errorType = 'service_unavailable';
      } else if (error?.message?.includes('HTML error page') || error?.message?.includes('API endpoint not available')) {
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a few moments.';
        errorType = 'service_unavailable';
      } else if (error?.message?.includes('Failed to fetch') || error?.name === 'NetworkError') {
        errorMessage = 'Network connection error. Please check your internet connection and try again.';
        errorType = 'network_error';
      } else if (error?.message?.includes('parse') || error?.message?.includes('JSON')) {
        errorMessage = 'Server response format error. Please try again or contact support if the issue persists.';
        errorType = 'parse_error';
      } else if (error?.message?.includes('Authentication') || error?.message?.includes('auth')) {
        errorMessage = 'Authentication required. Please log in and try again.';
        errorType = 'auth_error';
      }

      const errorMessageObj = {
        id: Date.now() + 2,
        type: 'error',
        error: errorType,
        message: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessageObj]);
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
    if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
      setMessages([]);
    }
  };

  const handleSaveToJournal = async (message) => {
    try {
      console.log('Saving to journal:', message);
      alert('Response saved to your Rights Journal! You can view it in the My Journal section.');
    } catch (error) {
      console.error('Error saving to journal:', error);
      alert('Failed to save to journal. Please try again.');
    }
  };

  const handleExportPDF = (message) => {
    console.log('Exporting to PDF:', message);
    alert('PDF export feature will be available soon. For now, you can copy the text or save to your journal.');
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

      let data = await response?.json();

      if (!response?.ok) {
        console.error('Feedback API error:', data);
        alert(`Failed to submit feedback: ${data?.message || 'Please try again.'}`);
        return;
      }

      alert('Thank you for your feedback! It helps us improve our service.');

    } catch (error) {
      console.error('Error submitting feedback:', error);

      let errorMessage = 'Failed to submit feedback. ';
      if (error?.name === 'NetworkError' || error?.message?.includes('Failed to fetch')) {
        errorMessage += 'Please check your connection and try again.';
      } else if (error?.message?.includes('Authentication') || error?.message?.includes('auth')) {
        errorMessage += 'Please log in and try again.';
      } else {
        errorMessage += 'Please try again or contact support if the issue persists.';
      }

      alert(errorMessage);
    }
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        {/* Header removed */}
        <div className="pt-4 h-screen flex flex-col">{/* was pt-16 when header existed */}
          {messages?.length === 0 ? (
            <WelcomeScreen onStartChat={handleStartChat} />
          ) : (
            <>
              <ChatHeader
                onNewChat={handleNewChat}
                onClearChat={handleClearChat}
                messageCount={messages?.filter(msg => msg?.type !== 'typing')?.length}
              />

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto bg-muted/20"
              >
                <div className="max-w-4xl mx-auto px-4 py-6">
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
            </>
          )}

          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
