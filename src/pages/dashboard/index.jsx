import React from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import WelcomeCard from './components/WelcomeCard';
import QuickStats from './components/QuickStats';
import QuickActions from './components/QuickActions';
import LegalTopicsGrid from './components/LegalTopicsGrid';
import RecentActivity from './components/RecentActivity';

const Dashboard = () => {
  const { user, userProfile, profileLoading } = useAuth();

  return (
    <>
      <Helmet>
        <title>Dashboard - BeReady Legal Guidance</title>
        <meta name="description" content="Your personal legal guidance dashboard. Track your rights, access guides, and get AI-powered legal assistance." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <Header />
        
        <main className="container mx-auto px-4 py-6 lg:py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}!
                  </h1>
                  <p className="text-gray-600">
                    Signed in as: <span className="font-medium">{user?.email}</span>
                    {userProfile?.role && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userProfile?.role?.charAt(0)?.toUpperCase() + userProfile?.role?.slice(1)}
                      </span>
                    )}
                  </p>
                  {profileLoading && (
                    <p className="text-sm text-gray-500 mt-1">Loading profile...</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Account created: {new Date(userProfile?.created_at || user?.created_at)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <WelcomeCard />
              <QuickStats />
              <LegalTopicsGrid />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;