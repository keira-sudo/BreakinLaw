import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import OAuthButtons from './components/OAuthButtons';
import TrustIndicators from './components/TrustIndicators';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Centered login card */}
        <div className="w-full max-w-md space-y-8">
          <LoginHeader />

          <div className="bg-card border border-border rounded-2xl shadow-card p-8">
            <LoginForm />
            <div className="mt-6">
              <OAuthButtons />
            </div>
          </div>
        </div>

        {/* Stuff under the form */}
        <div className="w-full max-w-4xl mt-10 space-y-8">
          <TrustIndicators />

          {/* Additional features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">24/7</span>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Always Available</h4>
              <p className="text-sm text-muted-foreground">
                Get legal guidance whenever you need it
              </p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BreakinLaw. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                UK Legal Disclaimer
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
