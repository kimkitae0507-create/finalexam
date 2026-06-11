'use client';

import React from 'react';
import { SelectedMenu } from '@/types/course';
import { BookOpen, LayoutDashboard } from 'lucide-react';
import KpiCards from './KpiCards';
import ChartsSection from './ChartsSection';
import CourseTable from './CourseTable';
import AiAnalysisSection from './AiAnalysisSection';
import BreadcrumbNav from './BreadcrumbNav';

interface MainContentProps {
  selectedItem: SelectedMenu;
  onSelectItem?: (item: SelectedMenu) => void;
}

export default function MainContent({ selectedItem, onSelectItem }: MainContentProps) {
  return (
    <div className="flex-1 p-6 md:p-8 w-full transition-colors duration-300">
      
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav selectedItem={selectedItem} onHomeClick={() => onSelectItem?.(null)} />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {selectedItem ? selectedItem.name : '전체 교과목 대시보드'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              2026-1학기
            </p>
          </div>
        </div>
      </div>

      {!selectedItem ? (
        /* ── Initial empty state ── */
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center bg-white dark:bg-gray-900 transition-all duration-300 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4 animate-bounce">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">대시보드 시작하기</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-sm">
              왼쪽 사이드바에서 대학 또는 학과를 선택하시면 자세한 교과목 분석 통계를 보실 수 있습니다.
            </p>
            <div className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 rounded-full">
              대학 또는 학과를 선택하세요.
            </div>
          </div>
          <AiAnalysisSection selectedItem={null} />
        </div>
      ) : (
        /* ── Selected state ── */
        <div className="space-y-8">
          {/* KPI cards */}
          <KpiCards selectedItem={selectedItem} />

          {/* Charts section */}
          <ChartsSection selectedItem={selectedItem} />

          {/* AI Analysis section */}
          <AiAnalysisSection selectedItem={selectedItem} />

          {/* Detailed course list table */}
          <CourseTable selectedItem={selectedItem} />
        </div>

      )}

    </div>
  );
}


