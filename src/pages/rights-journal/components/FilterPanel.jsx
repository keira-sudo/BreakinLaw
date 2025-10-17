import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const categories = [
    'All Categories',
    'Housing',
    'Tenancy', 
    'Consumer Rights',
    'Contracts',
    'General'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'category', label: 'By Category' },
    { value: 'relevance', label: 'Most Relevant' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.category !== 'All Categories' || 
           filters?.dateFrom || 
           filters?.dateTo ||
           filters?.sortBy !== 'newest';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={18} className="text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {hasActiveFilters() && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Show filters' : 'Hide filters'}
          >
            <Icon 
              name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} 
              size={16} 
            />
          </Button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`${isCollapsed ? 'hidden lg:block' : 'block'}`}>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <Input
              type="search"
              label="Search Entries"
              placeholder="Search queries, answers, or notes..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Legal Category
            </label>
            <div className="space-y-2">
              {categories?.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters?.category === category}
                    onChange={(e) => handleFilterChange('category', e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                type="date"
                label="From"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
              <Input
                type="date"
                label="To"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sort By
            </label>
            <div className="space-y-2">
              {sortOptions?.map((option) => (
                <label key={option?.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option?.value}
                    checked={filters?.sortBy === option?.value}
                    onChange={(e) => handleFilterChange('sortBy', e?.target?.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">{option?.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters?.hasNotes ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('hasNotes', !filters?.hasNotes)}
              >
                With Notes
              </Button>
              <Button
                variant={filters?.exported ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('exported', !filters?.exported)}
              >
                Exported
              </Button>
              <Button
                variant={filters?.recent ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('recent', !filters?.recent)}
              >
                Last 7 Days
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;