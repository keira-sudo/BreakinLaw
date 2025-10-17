import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import JournalEntry from './components/JournalEntry';
import FilterPanel from './components/FilterPanel';
import JournalStats from './components/JournalStats';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';
import EditNotesModal from './components/EditNotesModal';

const RightsJournal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
    hasNotes: false,
    exported: false,
    recent: false
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockEntries = [
      {
        id: 1,
        query: "Can my landlord increase rent during a fixed-term tenancy agreement?",
        category: "Tenancy",
        shortAnswer: "Generally, landlords cannot increase rent during a fixed-term tenancy unless there's a specific rent review clause in your tenancy agreement or you agree to the increase.",
        actionPlan: [
          "Check your tenancy agreement for any rent review clauses",
          "If no clause exists, you can refuse the increase during the fixed term",
          "Document all communications with your landlord about rent increases",
          "Contact Shelter or Citizens Advice if your landlord pressures you"
        ],
        consultationGuidance: "If your landlord is attempting to force a rent increase without proper legal grounds, consider consulting with a housing solicitor who specializes in tenant rights.",
        personalNotes: "My tenancy agreement expires in March 2025. Need to check clause 7 about rent reviews.",
        savedAt: new Date('2024-12-15T10:30:00'),
        exported: false
      },
      {
        id: 2,
        query: "What are my rights if I receive faulty goods from an online purchase?",
        category: "Consumer Rights",
        shortAnswer: "Under the Consumer Rights Act 2015, you have the right to a refund, repair, or replacement if goods are faulty, not as described, or not fit for purpose.",
        actionPlan: [
          "Contact the retailer immediately to report the fault",
          "Take photos of the faulty item as evidence",
          "Request a full refund within 30 days of purchase",
          "If after 30 days, you can request repair or replacement",
          "Keep all receipts and correspondence"
        ],
        consultationGuidance: "For high-value items or if the retailer refuses to cooperate, consider seeking advice from Trading Standards or a consumer rights specialist.",
        personalNotes: "",
        savedAt: new Date('2024-12-10T14:45:00'),
        exported: true
      },
      {
        id: 3,
        query: "How much notice does my landlord need to give for property inspections?",
        category: "Housing",
        shortAnswer: "Your landlord must give you at least 24 hours' written notice before entering your property for inspections, except in genuine emergencies.",
        actionPlan: [
          "Landlord must provide written notice (email, text, or letter)",
          "Notice must specify the date, time, and reason for entry",
          "You can refuse entry if proper notice isn't given",
          "Inspections should be at reasonable times (usually 8am-6pm)",
          "You have the right to be present during inspections"
        ],
        consultationGuidance: "If your landlord repeatedly enters without proper notice or harasses you, contact your local council's housing team or seek legal advice about harassment.",
        personalNotes: "Landlord has been giving less than 24 hours notice. Need to send formal complaint letter.",
        savedAt: new Date('2024-12-08T16:20:00'),
        exported: false
      },
      {
        id: 4,
        query: "Can I cancel a mobile phone contract within the cooling-off period?",
        category: "Contracts",
        shortAnswer: "Yes, you have 14 days to cancel most contracts signed online, over the phone, or at your home without giving a reason, under the Consumer Contracts Regulations.",
        actionPlan: [
          "Cancel within 14 days of signing the contract",
          "Send written notice to the company (email is acceptable)",
          "Use the company's cancellation form if they provide one",
          "Return any goods within 14 days of cancellation",
          "You may need to pay for any services already used"
        ],
        consultationGuidance: "If the company refuses to honor your cancellation rights or charges excessive fees, contact Citizens Advice or consider formal complaint procedures.",
        personalNotes: "Signed contract on 5th December, have until 19th December to cancel.",
        savedAt: new Date('2024-12-07T09:15:00'),
        exported: true
      },
      {
        id: 5,
        query: "What should I do if my deposit isn't protected by my landlord?",
        category: "Tenancy",
        shortAnswer: "If your landlord hasn't protected your deposit in an approved scheme within 30 days, you can claim compensation of 1-3 times the deposit amount through the courts.",
        actionPlan: [
          "Check if your deposit is protected using the three scheme websites",
          "Request deposit protection details from your landlord in writing",
          "If unprotected, send formal notice requesting protection",
          "Consider making a court claim for compensation",
          "Gather evidence of deposit payment and lack of protection"
        ],
        consultationGuidance: "Deposit protection claims can be complex. Consider consulting with a housing solicitor who can help you navigate the court process and maximize your compensation.",
        personalNotes: "",
        savedAt: new Date('2024-12-05T11:30:00'),
        exported: false
      }
    ];
    setEntries(mockEntries);
  }, []);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(entry => 
        entry?.query?.toLowerCase()?.includes(searchTerm) ||
        entry?.shortAnswer?.toLowerCase()?.includes(searchTerm) ||
        entry?.personalNotes?.toLowerCase()?.includes(searchTerm) ||
        entry?.category?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Category filter
    if (filters?.category !== 'All Categories') {
      filtered = filtered?.filter(entry => entry?.category === filters?.category);
    }

    // Date range filter
    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(entry => new Date(entry.savedAt) >= fromDate);
    }
    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(entry => new Date(entry.savedAt) <= toDate);
    }

    // Quick filters
    if (filters?.hasNotes) {
      filtered = filtered?.filter(entry => entry?.personalNotes && entry?.personalNotes?.trim()?.length > 0);
    }
    if (filters?.exported) {
      filtered = filtered?.filter(entry => entry?.exported);
    }
    if (filters?.recent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo?.setDate(sevenDaysAgo?.getDate() - 7);
      filtered = filtered?.filter(entry => new Date(entry.savedAt) >= sevenDaysAgo);
    }

    // Sort
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'oldest':
          return new Date(a.savedAt) - new Date(b.savedAt);
        case 'category':
          return a?.category?.localeCompare(b?.category);
        case 'relevance':
          // Simple relevance based on search term matches
          if (filters?.search) {
            const searchTerm = filters?.search?.toLowerCase();
            const aMatches = (a?.query?.toLowerCase()?.match(new RegExp(searchTerm, 'g')) || [])?.length;
            const bMatches = (b?.query?.toLowerCase()?.match(new RegExp(searchTerm, 'g')) || [])?.length;
            return bMatches - aMatches;
          }
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'newest':
        default:
          return new Date(b.savedAt) - new Date(a.savedAt);
      }
    });

    return filtered;
  }, [entries, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = entries?.filter(entry => {
      const entryDate = new Date(entry.savedAt);
      return entryDate?.getMonth() === now?.getMonth() && 
             entryDate?.getFullYear() === now?.getFullYear();
    })?.length;

    const categories = [...new Set(entries.map(entry => entry.category))];
    const exportedCount = entries?.filter(entry => entry?.exported)?.length;

    return {
      totalEntries: entries?.length,
      thisMonth,
      categoriesUsed: categories?.length,
      exportedPdfs: exportedCount
    };
  }, [entries]);

  // Handlers
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'All Categories',
      dateFrom: '',
      dateTo: '',
      sortBy: 'newest',
      hasNotes: false,
      exported: false,
      recent: false
    });
  };

  const handleViewEntry = (entry) => {
    // Navigate to detailed view or open modal
    console.log('View entry:', entry);
  };

  const handleExportEntry = async (entry) => {
    setIsExporting(true);
    try {
      // Simulate PDF export
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update entry as exported
      setEntries(prev => prev?.map(e => 
        e?.id === entry?.id ? { ...e, exported: true } : e
      ));
      
      console.log('Exported entry:', entry);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
  };

  const handleSaveNotes = async (entryId, notes) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEntries(prev => prev?.map(entry => 
      entry?.id === entryId ? { ...entry, personalNotes: notes } : entry
    ));
  };

  const handleDeleteEntry = (entry) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      setEntries(prev => prev?.filter(e => e?.id !== entry?.id));
      setSelectedEntries(prev => prev?.filter(id => id !== entry?.id));
    }
  };

  const handleSelectEntry = (entryId, selected) => {
    if (selected) {
      setSelectedEntries(prev => [...prev, entryId]);
    } else {
      setSelectedEntries(prev => prev?.filter(id => id !== entryId));
    }
  };

  const handleSelectAll = () => {
    setSelectedEntries(filteredEntries?.map(entry => entry?.id));
  };

  const handleClearSelection = () => {
    setSelectedEntries([]);
  };

  const handleBulkExport = async (entryIds) => {
    setIsExporting(true);
    try {
      // Simulate bulk PDF export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update entries as exported
      setEntries(prev => prev?.map(entry => 
        entryIds?.includes(entry?.id) ? { ...entry, exported: true } : entry
      ));
      
      console.log('Bulk exported entries:', entryIds);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDelete = (entryIds) => {
    if (window.confirm(`Are you sure you want to delete ${entryIds?.length} entries? This action cannot be undone.`)) {
      setEntries(prev => prev?.filter(entry => !entryIds?.includes(entry?.id)));
      setSelectedEntries([]);
    }
  };

  const hasActiveFilters = filters?.search || 
                          filters?.category !== 'All Categories' || 
                          filters?.dateFrom || 
                          filters?.dateTo ||
                          filters?.hasNotes ||
                          filters?.exported ||
                          filters?.recent ||
                          filters?.sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rights Journal</h1>
              <p className="text-muted-foreground">
                Your personal legal guidance library and knowledge base
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/ai-chat-interface')}
                iconName="MessageCircle"
                iconPosition="left"
              >
                Ask AI
              </Button>
              
              <Button
                variant="default"
                onClick={() => handleBulkExport(entries?.map(e => e?.id))}
                loading={isExporting}
                iconName="Download"
                iconPosition="left"
              >
                Export All
              </Button>
            </div>
          </div>

          {/* Stats */}
          <JournalStats stats={stats} />
        </div>

        {entries?.length === 0 ? (
          <EmptyState 
            hasFilters={false}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                isCollapsed={isFilterCollapsed}
                onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Bulk Actions */}
              <BulkActions
                selectedEntries={selectedEntries}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onBulkExport={handleBulkExport}
                onBulkDelete={handleBulkDelete}
                totalEntries={filteredEntries?.length}
              />

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {filteredEntries?.length === entries?.length 
                      ? `All Entries (${entries?.length})`
                      : `${filteredEntries?.length} of ${entries?.length} entries`
                    }
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      iconName="X"
                      iconPosition="left"
                      iconSize={14}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Selection Controls */}
                {filteredEntries?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectedEntries?.length === filteredEntries?.length ? handleClearSelection : handleSelectAll}
                      iconName={selectedEntries?.length === filteredEntries?.length ? "Square" : "CheckSquare"}
                      iconPosition="left"
                      iconSize={14}
                    >
                      {selectedEntries?.length === filteredEntries?.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Entries List */}
              {filteredEntries?.length === 0 ? (
                <EmptyState 
                  hasFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              ) : (
                <div className="space-y-4">
                  {filteredEntries?.map((entry) => (
                    <div key={entry?.id} className="relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 left-4 z-10">
                        <input
                          type="checkbox"
                          checked={selectedEntries?.includes(entry?.id)}
                          onChange={(e) => handleSelectEntry(entry?.id, e?.target?.checked)}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                        />
                      </div>
                      
                      <div className="pl-10">
                        <JournalEntry
                          entry={entry}
                          onView={handleViewEntry}
                          onExport={handleExportEntry}
                          onEdit={handleEditEntry}
                          onDelete={handleDeleteEntry}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Notes Modal */}
        <EditNotesModal
          entry={editingEntry}
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          onSave={handleSaveNotes}
        />
      </div>
    </div>
  );
};

export default RightsJournal;