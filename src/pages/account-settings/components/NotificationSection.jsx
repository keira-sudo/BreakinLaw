import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSection = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    legalAlerts: true,
    systemNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    urgentAlerts: true,
    newFeatures: false,
    maintenanceNotices: true
  });

  const handleNotificationChange = (key, checked) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const notificationGroups = [
    {
      title: 'Legal Updates',
      description: 'Important notifications about UK law changes and legal guidance',
      items: [
        {
          key: 'legalAlerts',
          label: 'Legal Alert Notifications',
          description: 'Urgent updates about changes in UK housing and consumer law'
        },
        {
          key: 'weeklyDigest',
          label: 'Weekly Legal Digest',
          description: 'Summary of new rights guides and legal developments'
        }
      ]
    },
    {
      title: 'Account & System',
      description: 'Notifications about your account and platform updates',
      items: [
        {
          key: 'emailUpdates',
          label: 'Email Notifications',
          description: 'General account updates and security notifications'
        },
        {
          key: 'systemNotifications',
          label: 'System Notifications',
          description: 'Platform updates and feature announcements'
        },
        {
          key: 'urgentAlerts',
          label: 'Urgent Security Alerts',
          description: 'Critical security notifications (always recommended)'
        },
        {
          key: 'maintenanceNotices',
          label: 'Maintenance Notices',
          description: 'Scheduled maintenance and downtime notifications'
        }
      ]
    },
    {
      title: 'Marketing & Features',
      description: 'Optional communications about new features and services',
      items: [
        {
          key: 'marketingEmails',
          label: 'Marketing Communications',
          description: 'Information about new services and partner offers'
        },
        {
          key: 'newFeatures',
          label: 'New Feature Announcements',
          description: 'Updates about new platform features and improvements'
        }
      ]
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="Bell" size={20} className="text-secondary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Choose how you want to receive updates and alerts</p>
        </div>
      </div>
      <div className="space-y-8">
        {notificationGroups?.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <div className="border-b border-border pb-3">
              <h4 className="font-medium text-foreground">{group?.title}</h4>
              <p className="text-sm text-muted-foreground">{group?.description}</p>
            </div>
            
            <div className="space-y-4 pl-4">
              {group?.items?.map((item) => (
                <div key={item?.key} className="flex items-start gap-3">
                  <Checkbox
                    checked={notifications?.[item?.key]}
                    onChange={(e) => handleNotificationChange(item?.key, e?.target?.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground cursor-pointer">
                      {item?.label}
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Email Frequency Settings */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">Email Frequency</h4>
            <p className="text-sm text-muted-foreground">Control how often you receive non-urgent emails</p>
          </div>
          <select className="px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly">Monthly Update</option>
          </select>
        </div>
      </div>
      {/* GDPR Compliance Notice */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">UK GDPR Compliance</p>
            <p className="text-xs text-muted-foreground mt-1">
              You can update your communication preferences at any time. We process your data in accordance with UK GDPR regulations and will never share your information with third parties without consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;