import React from 'react';
import Icon from '../../../components/AppIcon';

const JournalStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Entries',
      value: stats?.totalEntries,
      icon: 'BookOpen',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'This Month',
      value: stats?.thisMonth,
      icon: 'Calendar',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Categories Used',
      value: stats?.categoriesUsed,
      icon: 'Tag',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Exported PDFs',
      value: stats?.exportedPdfs,
      icon: 'Download',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${item?.bgColor} flex items-center justify-center`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
              <p className="text-sm text-muted-foreground truncate">{item?.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalStats;