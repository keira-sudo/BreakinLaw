import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PreferencesSection = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en-GB',
    timezone: 'Europe/London',
    dateFormat: 'DD/MM/YYYY',
    currency: 'GBP',
    autoSave: true,
    compactMode: false,
    showTips: true,
    emailDigestFrequency: 'weekly'
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const themeOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'system', label: 'System Default' }
  ];

  const languageOptions = [
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'en-US', label: 'English (US)' }
  ];

  const timezoneOptions = [
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Dublin', label: 'Dublin (GMT/IST)' },
    { value: 'Europe/Edinburgh', label: 'Edinburgh (GMT/BST)' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (UK Standard)' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO Format)' }
  ];

  const currencyOptions = [
    { value: 'GBP', label: '£ British Pound (GBP)' },
    { value: 'EUR', label: '€ Euro (EUR)' },
    { value: 'USD', label: '$ US Dollar (USD)' }
  ];

  const digestFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'never', label: 'Never' }
  ];

  const handleSavePreferences = () => {
    console.log('Saving preferences:', preferences);
    // Mock save functionality
  };

  const handleResetPreferences = () => {
    setPreferences({
      theme: 'light',
      language: 'en-GB',
      timezone: 'Europe/London',
      dateFormat: 'DD/MM/YYYY',
      currency: 'GBP',
      autoSave: true,
      compactMode: false,
      showTips: true,
      emailDigestFrequency: 'weekly'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
          <Icon name="Settings2" size={20} className="text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Display & Preferences</h3>
          <p className="text-sm text-muted-foreground">Customize your platform experience and interface settings</p>
        </div>
      </div>
      <div className="space-y-8">
        {/* Appearance Settings */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Appearance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Theme"
              description="Choose your preferred color scheme"
              options={themeOptions}
              value={preferences?.theme}
              onChange={(value) => handlePreferenceChange('theme', value)}
            />
            <Select
              label="Language"
              description="Platform display language"
              options={languageOptions}
              value={preferences?.language}
              onChange={(value) => handlePreferenceChange('language', value)}
            />
          </div>
        </div>

        {/* Regional Settings */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Regional Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Timezone"
              description="Your local timezone for scheduling"
              options={timezoneOptions}
              value={preferences?.timezone}
              onChange={(value) => handlePreferenceChange('timezone', value)}
            />
            <Select
              label="Date Format"
              description="How dates are displayed"
              options={dateFormatOptions}
              value={preferences?.dateFormat}
              onChange={(value) => handlePreferenceChange('dateFormat', value)}
            />
          </div>
          <div className="mt-4">
            <Select
              label="Currency"
              description="Default currency for financial examples"
              options={currencyOptions}
              value={preferences?.currency}
              onChange={(value) => handlePreferenceChange('currency', value)}
              className="md:w-1/2"
            />
          </div>
        </div>

        {/* Interface Settings */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Interface Settings</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={preferences?.autoSave}
                onChange={(e) => handlePreferenceChange('autoSave', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Auto-save Conversations
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically save AI chat conversations to your journal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={preferences?.compactMode}
                onChange={(e) => handlePreferenceChange('compactMode', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Compact Display Mode
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Show more content in less space with reduced padding
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                checked={preferences?.showTips}
                onChange={(e) => handlePreferenceChange('showTips', e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  Show Helpful Tips
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Display contextual tips and guidance throughout the platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Communication</h4>
          <Select
            label="Email Digest Frequency"
            description="How often you receive summary emails"
            options={digestFrequencyOptions}
            value={preferences?.emailDigestFrequency}
            onChange={(value) => handlePreferenceChange('emailDigestFrequency', value)}
            className="md:w-1/2"
          />
        </div>

        {/* Preview Section */}
        <div className="border-t border-border pt-6">
          <h4 className="font-medium text-foreground mb-4">Preview</h4>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="Eye" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Settings Preview</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Theme: {themeOptions?.find(t => t?.value === preferences?.theme)?.label}</p>
              <p>Date Format: {new Date()?.toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}</p>
              <p>Currency: {currencyOptions?.find(c => c?.value === preferences?.currency)?.label}</p>
              <p>Timezone: {timezoneOptions?.find(tz => tz?.value === preferences?.timezone)?.label}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={handleResetPreferences}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
      {/* UK Compliance Notice */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">UK Legal Jurisdiction</p>
            <p className="text-xs text-muted-foreground mt-1">
              These preferences are optimized for UK users. All legal guidance and examples will remain specific to UK law regardless of language or regional settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;