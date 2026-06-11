'use client';

import React from 'react';
import { useTheme } from '../ThemeProvider';
import { Sun, Moon, GraduationCap, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left side: Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl lg:text-2xl transition-colors duration-300">
              인천대학교 <span className="text-blue-600 dark:text-blue-400">2026-1학기</span> 전체 교과목 대시보드
            </h1>
          </div>
        </div>

        {/* Right side: Dark Mode Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none transition-all duration-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
            ) : (
              <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
