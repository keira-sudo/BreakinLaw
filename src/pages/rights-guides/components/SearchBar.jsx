import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onFilterChange, activeFilters = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'tenancy', label: 'Tenancy Rights', count: 8 },
    { id: 'housing', label: 'Housing Issues', count: 6 },
    { id: 'consumer', label: 'Consumer Rights', count: 7 },
    { id: 'contracts', label: 'Contracts', count: 4 },
    { id: 'deposits', label: 'Deposits', count: 3 },
    { id: 'repairs', label: 'Repairs & Maintenance', count: 5 }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters?.includes(filterId)
      ? activeFilters?.filter(f => f !== filterId)
      : [...activeFilters, filterId];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon name="Search" size={20} />
        </div>
        <Input
          type="search"
          placeholder="Search guides by topic, keyword, or legal issue..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 pr-12"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={() => {
              setSearchQuery('');
              onSearch('');
            }}
          >
            <Icon name="X" size={16} />
          </Button>
        )}
      </div>
      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          iconName={showFilters ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
        >
          Filter by Category
        </Button>
        {activeFilters?.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {activeFilters?.length} filter{activeFilters?.length !== 1 ? 's' : ''} active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-destructive hover:text-destructive"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      {/* Filter Categories */}
      {showFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories?.map((category) => (
              <label
                key={category?.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={activeFilters?.includes(category?.id)}
                  onChange={() => handleFilterToggle(category?.id)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    {category?.label}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({category?.count})
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
      {/* Active Filters */}
      {activeFilters?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {activeFilters?.map((filterId) => {
            const category = categories?.find(c => c?.id === filterId);
            return (
              <span
                key={filterId}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {category?.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-primary/20"
                  onClick={() => handleFilterToggle(filterId)}
                >
                  <Icon name="X" size={12} />
                </Button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;