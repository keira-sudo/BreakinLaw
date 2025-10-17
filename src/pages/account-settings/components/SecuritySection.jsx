import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [sessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'London, UK',
      lastActive: '2025-01-10 14:30',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'London, UK',
      lastActive: '2025-01-09 09:15',
      current: false
    },
    {
      id: 3,
      device: 'Firefox on MacOS',
      location: 'Manchester, UK',
      lastActive: '2025-01-08 16:45',
      current: false
    }
  ]);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleTerminateSession = (sessionId) => {
    console.log('Terminating session:', sessionId);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
          <Icon name="Shield" size={20} className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Security Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account security and active sessions</p>
        </div>
      </div>
      {/* Password Section */}
      <div className="space-y-6">
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-medium text-foreground">Password</h4>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Key"
              iconPosition="left"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
              <Input
                label="Current Password"
                type="password"
                value={passwordData?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                description="Must be at least 8 characters with mixed case and numbers"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                required
              />
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePasswordSubmit}
                >
                  Update Password
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div>
          <h4 className="font-medium text-foreground mb-4">Active Sessions</h4>
          <div className="space-y-3">
            {sessions?.map((session) => (
              <div key={session?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="Monitor" size={16} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{session?.device}</p>
                      {session?.current && (
                        <span className="px-2 py-1 text-xs bg-success/10 text-success rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session?.location} • Last active {session?.lastActive}
                    </p>
                  </div>
                </div>
                {!session?.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="LogOut"
                    onClick={() => handleTerminateSession(session?.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    End Session
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Smartphone"
              iconPosition="left"
            >
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;