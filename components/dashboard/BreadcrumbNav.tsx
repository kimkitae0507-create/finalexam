'use client';

import React from 'react';
import { SelectedMenu } from '@/types/course';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbNavProps {
  selectedItem: SelectedMenu;
  onHomeClick?: () => void;
}

export default function BreadcrumbNav({ selectedItem, onHomeClick }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 bg-white dark:bg-gray-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
      {/* Home / 전체 */}
      <button
        onClick={onHomeClick}
        className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
      >
        <Home className="h-4 w-4" />
        <span>전체</span>
      </button>

      {/* College Level */}
      {selectedItem && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
          {selectedItem.type === 'college' ? (
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedItem.name}
            </span>
          ) : (
            <span className="font-medium text-gray-500 dark:text-gray-400">
              {selectedItem.college}
            </span>
          )}
        </>
      )}

      {/* Department Level */}
      {selectedItem && selectedItem.type === 'department' && (
        <>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-700" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {selectedItem.name}
          </span>
        </>
      )}
    </nav>
  );
}
