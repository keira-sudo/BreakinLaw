import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import PersonalInfoSection from './components/PersonalInfoSection';
import SecuritySection from './components/SecuritySection';
import NotificationSection from './components/NotificationSection';
import PrivacySection from './components/PrivacySection';
import PreferencesSection from './components/PreferencesSection';
import Icon from '../../components/AppIcon';

const AccountSettings = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const settingsSections = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'User',
      component: PersonalInfoSection
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      component: SecuritySection
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      component: NotificationSection
    },
    {
      id: 'privacy',
      label: 'Privacy & Data',
      icon: 'Lock',
      component: PrivacySection
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings2',
      component: PreferencesSection
    }
  ];

  const ActiveComponent = settingsSections?.find(section => section?.id === activeSection)?.component || PersonalInfoSection;

  return (
    <>
      <Helmet>
        <title>Account Settings - BeReady Legal Guidance</title>
        <meta name="description" content="Manage your account settings, privacy preferences, and notification options for BeReady legal guidance platform." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={handleMobileMenuClose}
        />

        {/* Main Content */}
        <div className="lg:ml-60">
          {/* Header */}
          <Header 
            onMobileMenuToggle={handleMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* Page Content */}
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-6 py-8">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="Settings" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
                    <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Navigation - Desktop */}
                <div className="hidden lg:block">
                  <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
                    <h3 className="font-semibold text-foreground mb-4">Settings</h3>
                    <nav className="space-y-1">
                      {settingsSections?.map((section) => (
                        <button
                          key={section?.id}
                          onClick={() => setActiveSection(section?.id)}
                          className={`
                            w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                            ${activeSection === section?.id 
                              ? 'bg-primary/10 text-primary border-l-4 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
                          `}
                        >
                          <Icon 
                            name={section?.icon} 
                            size={18}
                            className={activeSection === section?.id ? 'text-primary' : ''}
                          />
                          <span className="text-sm font-medium">{section?.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Settings Navigation - Mobile */}
                <div className="lg:hidden">
                  <div className="bg-card border border-border rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {settingsSections?.map((section) => (
                        <button
                          key={section?.id}
                          onClick={() => setActiveSection(section?.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200
                            ${activeSection === section?.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }
                          `}
                        >
                          <Icon 
                            name={section?.icon} 
                            size={16}
                            className={activeSection === section?.id ? 'text-primary-foreground' : ''}
                          />
                          <span className="text-sm font-medium">{section?.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-3">
                  <ActiveComponent />
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Icon name="Shield" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">UK GDPR Compliant</p>
                      <p className="text-xs text-muted-foreground">Your data is protected under UK law</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Lock" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Secure Encryption</p>
                      <p className="text-xs text-muted-foreground">End-to-end data protection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon name="Award" size={20} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Legal Certified</p>
                      <p className="text-xs text-muted-foreground">Verified UK legal guidance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;