import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SearchBar from './components/SearchBar';
import QuickActions from './components/QuickActions';
import FeaturedGuides from './components/FeaturedGuides';
import CategorySection from './components/CategorySection';
import TrustIndicators from './components/TrustIndicators';

const RightsGuides = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);

  // Mock guides data
  const allGuides = [
    {
      id: 'deposit-protection',
      title: 'Deposit Protection Schemes',
      category: 'Tenancy Rights',
      description: `Learn about the three government-approved deposit protection schemes in the UK, your rights as a tenant, and how to reclaim your deposit at the end of your tenancy.`,
      icon: 'Shield',
      iconBg: 'bg-primary',
      keyTopics: ['TDP Schemes', 'Deposit Return', 'Dispute Resolution', 'Landlord Obligations'],
      readTime: '8 min read',
      sections: 6,
      isNew: false,
      categoryId: 'tenancy'
    },
    {
      id: 'eviction-procedures',
      title: 'Eviction Procedures & Rights',
      category: 'Housing Rights',
      description: `Understanding Section 8 and Section 21 notices, your rights during eviction proceedings, and what steps you can take to challenge unfair evictions.`,
      icon: 'Home',
      iconBg: 'bg-destructive',
      keyTopics: ['Section 21', 'Section 8', 'Court Proceedings', 'Tenant Rights'],
      readTime: '12 min read',
      sections: 8,
      isNew: false,
      categoryId: 'housing'
    },
    {
      id: 'repair-responsibilities',
      title: 'Repair Responsibilities',
      category: 'Housing Rights',
      description: `Know what repairs your landlord is responsible for, how to report issues properly, and your rights when repairs are not carried out promptly.`,
      icon: 'Wrench',
      iconBg: 'bg-warning',
      keyTopics: ['Landlord Duties', 'Repair Requests', 'Disrepair Claims', 'Emergency Repairs'],
      readTime: '10 min read',
      sections: 7,
      isNew: true,
      categoryId: 'repairs'
    },
    {
      id: 'consumer-refunds',
      title: 'Consumer Refunds & Returns',
      category: 'Consumer Rights',
      description: `Your rights under the Consumer Rights Act 2015, how to claim refunds for faulty goods, and dealing with online purchase disputes.`,
      icon: 'CreditCard',
      iconBg: 'bg-success',
      keyTopics: ['Consumer Rights Act', 'Faulty Goods', 'Online Purchases', 'Refund Rights'],
      readTime: '6 min read',
      sections: 5,
      isNew: false,
      categoryId: 'consumer'
    },
    {
      id: 'unfair-contracts',
      title: 'Unfair Contract Terms',
      category: 'Contracts',
      description: `Identifying unfair terms in contracts, your rights under the Unfair Contract Terms Act, and how to challenge unreasonable clauses.`,
      icon: 'FileText',
      iconBg: 'bg-secondary',
      keyTopics: ['Contract Law', 'Unfair Terms', 'Consumer Protection', 'Legal Remedies'],
      readTime: '9 min read',
      sections: 6,
      isNew: false,
      categoryId: 'contracts'
    },
    {
      id: 'landlord-obligations',
      title: 'Landlord Legal Obligations',
      category: 'Tenancy Rights',
      description: `Complete guide to what your landlord must legally provide, including safety certificates, property standards, and tenant rights.`,
      icon: 'CheckCircle',
      iconBg: 'bg-primary',
      keyTopics: ['Safety Certificates', 'Property Standards', 'Right to Quiet Enjoyment', 'Legal Requirements'],
      readTime: '11 min read',
      sections: 9,
      isNew: true,
      categoryId: 'tenancy'
    },
    {
      id: 'housing-benefit-rights',
      title: 'Housing Benefit & Universal Credit',
      category: 'Housing Rights',
      description: `Understanding your rights to housing benefit, Universal Credit housing element, and dealing with benefit-related tenancy issues.`,
      icon: 'PoundSterling',
      iconBg: 'bg-accent',
      keyTopics: ['Housing Benefit', 'Universal Credit', 'Benefit Rights', 'Landlord Discrimination'],
      readTime: '7 min read',
      sections: 5,
      isNew: false,
      categoryId: 'housing'
    },
    {
      id: 'online-shopping-rights',
      title: 'Online Shopping Rights',
      category: 'Consumer Rights',
      description: `Your rights when shopping online, dealing with delivery issues, digital content problems, and distance selling regulations.`,
      icon: 'ShoppingCart',
      iconBg: 'bg-success',
      keyTopics: ['Distance Selling', 'Digital Rights', 'Delivery Issues', 'Cancellation Rights'],
      readTime: '5 min read',
      sections: 4,
      isNew: true,
      categoryId: 'consumer'
    }
  ];

  // Categories for organization
  const categories = [
    {
      id: 'tenancy',
      title: 'Tenancy Rights',
      description: 'Your rights and responsibilities as a tenant',
      icon: 'Home',
      iconBg: 'bg-primary'
    },
    {
      id: 'housing',
      title: 'Housing Issues',
      description: 'Dealing with housing problems and disputes',
      icon: 'Building',
      iconBg: 'bg-destructive'
    },
    {
      id: 'consumer',
      title: 'Consumer Rights',
      description: 'Protection when buying goods and services',
      icon: 'ShoppingBag',
      iconBg: 'bg-success'
    },
    {
      id: 'contracts',
      title: 'Contracts & Agreements',
      description: 'Understanding your contractual rights',
      icon: 'FileText',
      iconBg: 'bg-secondary'
    },
    {
      id: 'repairs',
      title: 'Repairs & Maintenance',
      description: 'Property repair rights and responsibilities',
      icon: 'Wrench',
      iconBg: 'bg-warning'
    }
  ];

  // Filter guides based on search and filters
  useEffect(() => {
    let filtered = allGuides;

    // Apply search filter
    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(guide =>
        guide?.title?.toLowerCase()?.includes(query) ||
        guide?.description?.toLowerCase()?.includes(query) ||
        guide?.keyTopics?.some(topic => topic?.toLowerCase()?.includes(query)) ||
        guide?.category?.toLowerCase()?.includes(query)
      );
    }

    // Apply category filters
    if (activeFilters?.length > 0) {
      filtered = filtered?.filter(guide =>
        activeFilters?.includes(guide?.categoryId)
      );
    }

    setFilteredGuides(filtered);
  }, [searchQuery, activeFilters]);

  const handleStartChat = (guideTitle) => {
    navigate('/ai-chat-interface', {
      state: {
        initialMessage: `I need help with ${guideTitle?.toLowerCase()}. Can you provide guidance?`
      }
    });
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Group filtered guides by category
  const groupedGuides = categories?.reduce((acc, category) => {
    const categoryGuides = filteredGuides?.filter(guide => guide?.categoryId === category?.id);
    if (categoryGuides?.length > 0) {
      acc[category.id] = {
        category,
        guides: categoryGuides
      };
    }
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Rights Guides - BeReady Legal Guidance</title>
        <meta name="description" content="Comprehensive UK legal guides covering tenancy rights, housing issues, consumer protection, and contract law. Get clear, actionable guidance in plain English." />
        <meta name="keywords" content="UK legal guides, tenancy rights, housing law, consumer rights, legal help, UK jurisdiction" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={false}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={handleMobileMenuClose}
        />

        {/* Main Content */}
        <div className="lg:ml-60 min-h-screen">
          {/* Header */}
          <Header
            onMobileMenuToggle={handleMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* Page Content */}
          <main className="pt-16 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Icon name="BookOpen" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Rights Guides</h1>
                    <p className="text-muted-foreground">
                      Comprehensive UK legal guidance in plain English
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="FileText" size={16} />
                    {allGuides?.length} guides available
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="MapPin" size={16} />
                    UK jurisdiction only
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="RefreshCw" size={16} />
                    Updated {new Date()?.toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <QuickActions />

              {/* Search and Filters */}
              <SearchBar
                onSearch={setSearchQuery}
                onFilterChange={setActiveFilters}
                activeFilters={activeFilters}
              />

              {/* Results Summary */}
              {(searchQuery || activeFilters?.length > 0) && (
                <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Search" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {filteredGuides?.length} guide{filteredGuides?.length !== 1 ? 's' : ''} found
                        {searchQuery && ` for "${searchQuery}"`}
                        {activeFilters?.length > 0 && ` with ${activeFilters?.length} filter${activeFilters?.length !== 1 ? 's' : ''}`}
                      </span>
                    </div>
                    {(searchQuery || activeFilters?.length > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setActiveFilters([]);
                        }}
                        iconName="X"
                        iconPosition="left"
                        iconSize={14}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Featured Guides - only show when no search/filters */}
              {!searchQuery && activeFilters?.length === 0 && (
                <FeaturedGuides onStartChat={handleStartChat} />
              )}

              {/* Guide Categories */}
              {Object.keys(groupedGuides)?.length > 0 ? (
                <div className="space-y-8">
                  {Object.values(groupedGuides)?.map(({ category, guides }) => (
                    <CategorySection
                      key={category?.id}
                      category={category}
                      guides={guides}
                      onStartChat={handleStartChat}
                    />
                  ))}
                </div>
              ) : (
                // No results state
                (<div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No guides found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any guides matching your search criteria. 
                    Try adjusting your search terms or removing some filters.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveFilters([]);
                      }}
                      iconName="RotateCcw"
                      iconPosition="left"
                    >
                      Clear Search
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => navigate('/ai-chat-interface')}
                      iconName="MessageCircle"
                      iconPosition="left"
                    >
                      Ask AI Instead
                    </Button>
                  </div>
                </div>)
              )}

              {/* Trust Indicators */}
              <TrustIndicators />

              {/* Legal Disclaimer */}
              <div className="mt-8 p-6 bg-muted/30 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Important Legal Disclaimer</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>UK Jurisdiction Only:</strong> All guidance provided is specific to UK law (England, Wales, Scotland, and Northern Ireland) and may not apply to other jurisdictions.
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Not Legal Advice:</strong> This information is for educational purposes only and does not constitute legal advice. For specific legal matters, please consult with a qualified UK solicitor.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Currency & Dates:</strong> All financial examples use GBP (£) and dates follow DD/MM/YYYY format as per UK standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default RightsGuides;