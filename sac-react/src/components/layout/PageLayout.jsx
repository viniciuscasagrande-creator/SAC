import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function PageLayout({ 
  children, 
  currentTab, 
  onSelectTab, 
  searchQuery, 
  onSearchChange,
  marketingSubTab,
  onSelectMarketingSubTab
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f1f3f7]">
      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentTab={currentTab} 
          onSelectTab={onSelectTab} 
          marketingSubTab={marketingSubTab}
          onSelectMarketingSubTab={onSelectMarketingSubTab}
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
