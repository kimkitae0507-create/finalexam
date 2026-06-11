'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MainContent from '@/components/dashboard/MainContent';
import Footer from '@/components/layout/Footer';
import { CourseSidebarItem, SelectedMenu } from '@/types/course';

interface DashboardShellProps {
  initialSidebarData: CourseSidebarItem[];
}

export default function DashboardShell({ initialSidebarData }: DashboardShellProps) {
  const [selectedItem, setSelectedItem] = useState<SelectedMenu>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Header */}
      <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

      {/* Main Layout (Sidebar + Main Content) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative">
        {/* Sidebar */}
        <Sidebar
          sidebarData={initialSidebarData}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dashboard Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <MainContent selectedItem={selectedItem} onSelectItem={setSelectedItem} />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
