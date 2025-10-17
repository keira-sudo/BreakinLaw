import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import OAuthButtons from './components/OAuthButtons';
import TrustIndicators from './components/TrustIndicators';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
            {/* Left column - Login form */}
            <div className="w-full max-w-md mx-auto lg:mx-0 space-y-8">
              <LoginHeader />
              
              <div className="bg-card border border-border rounded-2xl shadow-card p-8">
                <LoginForm />
                <div className="mt-6">
                  <OAuthButtons />
                </div>
              </div>

              {/* Mobile trust indicators */}
              <div className="lg:hidden">
                <TrustIndicators />
              </div>
            </div>

            {/* Right column - Trust indicators (desktop only) */}
            <div className="hidden lg:block">
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-bold text-foreground">
                    Trusted Legal Guidance for UK Residents
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                    Get instant, reliable answers to your housing, tenancy, and consumer rights questions from our AI assistant trained on UK law.
                  </p>
                </div>
                
                <TrustIndicators />

                {/* Additional features */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-6 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary">24/7</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Always Available</h4>
                    <p className="text-sm text-muted-foreground">Get legal guidance whenever you need it</p>
                  </div>
                  
                  <div className="text-center p-6 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-secondary">£0</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Completely Free</h4>
                    <p className="text-sm text-muted-foreground">No hidden costs or subscription fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} BeReady. All rights reserved.
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