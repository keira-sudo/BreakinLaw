import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PersonalInfoSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+44 7700 900123',
    address: '123 High Street, London, SW1A 1AA'
  });
  const [originalData, setOriginalData] = useState({ ...formData });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Mock save functionality
    console.log('Saving personal info:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
            <p className="text-sm text-muted-foreground">Manage your account details and contact information</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit2"
            iconPosition="left"
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            value={formData?.fullName}
            onChange={(e) => handleInputChange('fullName', e?.target?.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            disabled={!isEditing}
            description="Used for account notifications and legal updates"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            type="tel"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            disabled={!isEditing}
            placeholder="+44 7700 900000"
          />
          <Input
            label="Address"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            disabled={!isEditing}
            description="UK address for jurisdiction verification"
          />
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      {/* UK Jurisdiction Notice */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">UK Jurisdiction</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your account is configured for UK legal guidance. All advice and resources are specific to UK law and regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;