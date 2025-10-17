import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from "pages/NotFound";
import RightsJournal from './pages/rights-journal';
import LoginPage from './pages/login';
import AccountSettings from './pages/account-settings';
import Dashboard from './pages/dashboard';
import AIChatInterface from './pages/ai-chat-interface';
import RightsGuides from './pages/rights-guides';
import RegisterPage from './pages/register';

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public routes - redirect to dashboard if authenticated */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <RegisterPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rights-journal" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <RightsJournal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rights-guides" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <RightsGuides />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-chat" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AIChatInterface />
                </ProtectedRoute>
              } 
            />
            <Route path="/ai-chat-interface" element={<Navigate to="/ai-chat" replace />} />
            <Route 
              path="/account-settings" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <AccountSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;