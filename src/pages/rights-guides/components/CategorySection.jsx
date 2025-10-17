import React from 'react';
import Icon from '../../../components/AppIcon';
import GuideCard from './GuideCard';

const CategorySection = ({ category, guides, onStartChat }) => {
  if (!guides || guides?.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${category?.iconBg} flex items-center justify-center`}>
          <Icon name={category?.icon} size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {category?.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {category?.description}
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
            {guides?.length} guide{guides?.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      {/* Guides Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guides?.map((guide) => (
          <GuideCard
            key={guide?.id}
            guide={guide}
            onStartChat={onStartChat}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;