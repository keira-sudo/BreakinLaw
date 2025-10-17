import React from 'react';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import TrustSignals from './components/TrustSignals';

const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Create Your Account - BeReady Legal Guidance</title>
        <meta name="description" content="Create your free BeReady account and get instant access to AI-powered legal guidance for UK residents. Understand your rights in plain English." />
        <meta name="keywords" content="UK legal guidance, tenant rights, consumer rights, legal advice, housing law, free account" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Welcome Header with embedded form */}
            <div className="text-center mb-8 lg:mb-12">
              <WelcomeHeader />
            </div>

            {/* Trust & Security Section - Moved to Bottom */}
            <div className="mt-8 lg:mt-12">
              <TrustSignals />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;