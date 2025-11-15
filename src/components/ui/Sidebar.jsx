import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Overview and recent activity'
    },
    {
      label: 'Ask AI',
      path: '/ai-chat-interface',
      icon: 'MessageCircle',
      tooltip: 'Get instant legal guidance'
    },
    {
      label: 'My Journal',
      path: '/rights-journal',
      icon: 'BookOpen',
      tooltip: 'Saved content and notes'
    },
    {
      label: 'Rights Guides',
      path: '/rights-guides',
      icon: 'FileText',
      tooltip: 'Educational legal resources'
    },
    {
      label: 'Settings',
      path: '/account-settings',
      icon: 'Settings',
      tooltip: 'Account and preferences'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  const isActive = (path) => location?.pathname === path;

  // Logo component
  const Logo = () => (
    <div className="flex items-center gap-3 px-4 py-6">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Icon name="Scale" size={20} color="white" />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gradient">BreakinLaw</span>
          <span className="text-xs text-muted-foreground">Legal empowerment</span>
        </div>
      )}
    </div>
  );

  // Navigation item component
  const NavItem = ({ item }) => {
    const active = isActive(item?.path);
    
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          size="default"
          className={`
            w-full justify-start gap-3 px-4 py-3 h-12 rounded-lg transition-all duration-200
            ${active 
              ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
          onClick={() => handleNavigation(item?.path)}
        >
          <Icon 
            name={item?.icon} 
            size={20}
            className={`flex-shrink-0 ${active ? 'text-primary' : ''}`}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm">{item?.label}</span>
          )}
        </Button>
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-modal border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-200">
            {item?.label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
          </div>
        )}
      </div>
    );
  };

  // Desktop sidebar
  const DesktopSidebar = () => (
    <aside className={`
      fixed left-0 top-0 h-full bg-card border-r border-border shadow-card z-100 transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-60'}
    `}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Logo />
        
        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navigationItems?.map((item) => (
            <NavItem key={item?.path} item={item} />
          ))}
        </nav>
        
        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>UK Legal Guidance</p>
              <p className="mt-1">© 2025 BeReady</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  // Mobile sidebar overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-150 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-60 bg-card border-r border-border shadow-floating z-200 lg:hidden
        transform transition-transform duration-300 ease-spring
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              aria-label="Close menu"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems?.map((item) => (
              <NavItem key={item?.path} item={item} />
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>UK Legal Guidance</p>
              <p className="mt-1">© 2025 BeReady</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
      
      {/* Mobile sidebar - hidden on desktop */}
      <MobileSidebar />
    </>
  );
};

export default Sidebar;