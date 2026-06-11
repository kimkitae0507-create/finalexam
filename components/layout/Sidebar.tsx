import React from 'react';
import { CourseSidebarItem, SelectedMenu } from '@/types/course';
import { ChevronDown, School, X } from 'lucide-react';

interface SidebarProps {
  sidebarData: CourseSidebarItem[];
  selectedItem: SelectedMenu;
  onSelectItem: (item: SelectedMenu) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ sidebarData, selectedItem, onSelectItem, isOpen, onClose }: SidebarProps) {
  
  const handleCollegeClick = (collegeName: string) => {
    onSelectItem({ type: 'college', name: collegeName });
    onClose();
  };

  const handleDeptClick = (collegeName: string, deptName: string) => {
    onSelectItem({ type: 'department', name: deptName, college: collegeName });
    onClose();
  };

  const isCollegeSelected = (collegeName: string) => {
    return selectedItem?.type === 'college' && selectedItem.name === collegeName;
  };

  const isDeptSelected = (collegeName: string, deptName: string) => {
    return (
      selectedItem?.type === 'department' &&
      selectedItem.name === deptName &&
      selectedItem.college === collegeName
    );
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col h-full`}
      >
        {/* Mobile Header (Close button) */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <div className="flex items-center gap-2">
            <School className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-900 dark:text-white">학부/학과 선택</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 mb-6">
          <School className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            학부/학과 목록
          </span>
        </div>

        {/* Scrollable navigation list */}
        <nav className="flex-1 overflow-y-auto space-y-4 pr-1">
          {(!sidebarData || sidebarData.length === 0) ? (
            <div className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
              데이터를 불러올 수 없습니다.
            </div>
          ) : (
            sidebarData.map((item) => {
              const isCollegeActive = isCollegeSelected(item.college);
              return (
                <div key={item.college} className="space-y-1">
                  {/* College Title (Clickable) */}
                  <button
                    onClick={() => handleCollegeClick(item.college)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-200 group cursor-pointer ${
                      isCollegeActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{item.college}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </button>

                  {/* Departments list (Always expanded as requested) */}
                  <div className="pl-4 mt-1 space-y-1 border-l border-gray-100 dark:border-gray-800 ml-5">
                    {item.departments.map((dept) => {
                      const isDeptActive = isDeptSelected(item.college, dept);
                      return (
                        <button
                          key={dept}
                          onClick={() => handleDeptClick(item.college, dept)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                            isDeptActive
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                          }`}
                        >
                          {dept}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </nav>
      </aside>
    </>
  );
}
