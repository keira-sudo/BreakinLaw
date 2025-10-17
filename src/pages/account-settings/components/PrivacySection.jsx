import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySection = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataProcessing: true,
    analyticsTracking: false,
    marketingConsent: false,
    thirdPartySharing: false,
    profileVisibility: 'private'
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDataExport = () => {
    console.log('Exporting user data...');
    // Mock data export functionality
    const exportData = {
      personalInfo: 'User personal information',
      chatHistory: 'AI chat conversations',
      savedContent: 'Saved legal guidance',
      preferences: 'Account preferences'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beready-data-export-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);
  };

  const handleAccountDeletion = () => {
    console.log('Account deletion requested');
    setShowDeleteConfirm(false);
    // Mock account deletion process
  };

  const dataCategories = [
    {
      title: 'Personal Information',
      description: 'Name, email, phone number, and address',
      lastUpdated: '2025-01-10',
      size: '2.3 KB'
    },
    {
      title: 'Chat History',
      description: 'AI conversations and legal guidance requests',
      lastUpdated: '2025-01-10',
      size: '45.7 KB'
    },
    {
      title: 'Saved Content',
      description: 'Bookmarked guides and exported responses',
      lastUpdated: '2025-01-09',
      size: '12.1 KB'
    },
    {
      title: 'Usage Analytics',
      description: 'Platform usage patterns and preferences',
      lastUpdated: '2025-01-10',
      size: '8.9 KB'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="Lock" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Privacy & Data Control</h3>
          <p className="text-sm text-muted-foreground">Manage your data privacy and consent preferences</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Privacy Preferences */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Privacy Preferences</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={privacySettings?.dataProcessing}
                onChange={(e) => handlePrivacyChange('dataProcessing', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Essential Data Processing
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Required for core platform functionality and legal guidance services (cannot be disabled)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={privacySettings?.analyticsTracking}
                onChange={(e) => handlePrivacyChange('analyticsTracking', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Analytics & Performance Tracking
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Help us improve the platform by sharing anonymous usage data
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={privacySettings?.marketingConsent}
                onChange={(e) => handlePrivacyChange('marketingConsent', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Marketing Communications
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Receive promotional content and partner offers via email
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={privacySettings?.thirdPartySharing}
                onChange={(e) => handlePrivacyChange('thirdPartySharing', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Third-Party Data Sharing
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Share anonymized data with legal research partners (UK universities only)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Categories */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Your Data</h4>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleDataExport}
            >
              Export All Data
            </Button>
          </div>
          
          <div className="space-y-3">
            {dataCategories?.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Database" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{category?.title}</p>
                    <p className="text-xs text-muted-foreground">{category?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{category?.size}</p>
                  <p className="text-xs text-muted-foreground">Updated {category?.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Retention */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Data Retention</h4>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Icon name="Clock" size={16} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Automatic Data Cleanup</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Chat history older than 2 years is automatically archived. Personal data is retained as long as your account is active, in compliance with UK GDPR requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="AlertTriangle" size={20} className="text-destructive mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-medium text-destructive">Confirm Account Deletion</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone. All your data, including chat history, saved content, and account information will be permanently deleted within 30 days.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleAccountDeletion}
                    >
                      Yes, Delete My Account
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* UK GDPR Notice */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">UK GDPR Rights</p>
            <p className="text-xs text-muted-foreground mt-1">
              Under UK GDPR, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. Contact our Data Protection Officer at privacy@beready.uk for any data protection queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;