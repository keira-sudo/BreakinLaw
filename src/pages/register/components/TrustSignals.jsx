import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-100">
      {/* Trust & Security Section Header */}
      <div className="text-center mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          Trust & Security
        </h3>
        <p className="text-sm text-gray-500">
          Protected by industry-leading security standards
        </p>
      </div>

      {/* Trust Badges Grid - Clean 2 rows max */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {/* Row 1 */}
        <div className="text-center p-2">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="Shield" size={16} className="text-green-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">UK GDPR</p>
          <p className="text-xs text-gray-500">Compliant</p>
        </div>

        <div className="text-center p-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="Award" size={16} className="text-blue-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">Legal</p>
          <p className="text-xs text-gray-500">Certified</p>
        </div>

        <div className="text-center p-2">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="Lock" size={16} className="text-purple-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">Secure</p>
          <p className="text-xs text-gray-500">& Private</p>
        </div>

        <div className="text-center p-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="Users" size={16} className="text-orange-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">Trusted by</p>
          <p className="text-xs text-gray-500">10,000+</p>
        </div>

        {/* Row 2 */}
        <div className="text-center p-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="CheckCircle" size={16} className="text-indigo-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">Solicitor</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>

        <div className="text-center p-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="FileCheck" size={16} className="text-gray-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">ISO 27001</p>
          <p className="text-xs text-gray-500">Certified</p>
        </div>
      </div>

      {/* Government Approved Badge - Separate row for emphasis */}
      <div className="flex justify-center mt-4">
        <div className="text-center p-2">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <Icon name="Crown" size={16} className="text-red-600" />
          </div>
          <p className="text-xs font-medium text-gray-900">Government</p>
          <p className="text-xs text-gray-500">Approved</p>
        </div>
      </div>

      {/* Minimal Legal Notice */}
      <div className="text-center mt-6 pt-4 border-t border-gray-50">
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          BeReady provides general legal guidance for UK residents. For specific matters, consult a qualified solicitor.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;