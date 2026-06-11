'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import { CourseTableRow, SelectedMenu } from '@/types/course';

interface CourseTableProps {
  selectedItem: SelectedMenu;
}

export default function CourseTable({ selectedItem }: CourseTableProps) {
  const [courses, setCourses] = useState<CourseTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Favorites state using lazy initialization to avoid useEffect set-state warning
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('inu_favorites');
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        console.error('Failed to load favorites', err);
      }
    }
    return [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const toggleFavorite = (courseId: string) => {
    const updated = favorites.includes(courseId)
      ? favorites.filter((id) => id !== courseId)
      : [...favorites, courseId];
    setFavorites(updated);
    try {
      localStorage.setItem('inu_favorites', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save favorites', err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1); // Reset page on selection change

    const params = new URLSearchParams({ action: 'table' });
    if (selectedItem) {
      params.append('type', selectedItem.type);
      params.append('name', selectedItem.name);
      if (selectedItem.type === 'department' && 'college' in selectedItem) {
        params.append('college', selectedItem.college);
      }
    }

    fetch(`/api/course?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch table data');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError('강좌 목록을 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedItem]);

  // Filter courses based on search term (교과목명, 담당교수, 학과명)
  const filteredCourses = courses.filter((course) => {
    // 즐겨찾기만 보기 활성화 시 필터링
    if (showOnlyFavorites && !favorites.includes(course.id)) return false;

    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    return (
      course.name.toLowerCase().includes(searchLower) ||
      course.professor.toLowerCase().includes(searchLower) ||
      course.department.toLowerCase().includes(searchLower) ||
      course.code.toLowerCase().includes(searchLower)
    );
  });

  // 검색어 하이라이트 헬퍼 함수
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-yellow-100 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-100 px-0.5 rounded font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Calculate pagination details
  const totalItems = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden p-6 transition-all duration-200">
      
      {/* Header and Search control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">상세 강좌 목록</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            필터링된 강좌 개수: <span className="font-semibold text-blue-600 dark:text-blue-400">{totalItems}개</span>
          </p>
        </div>
        
        {/* Controls: Search and Favorite Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Favorites filter toggle */}
          <button
            onClick={() => {
              setShowOnlyFavorites(!showOnlyFavorites);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer w-full sm:w-auto justify-center ${
              showOnlyFavorites
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Star className={`h-4 w-4 ${showOnlyFavorites ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
            즐겨찾기만 보기
          </button>

          {/* Search input bar */}
          <div className="relative w-full sm:w-64 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="과목명, 교수명, 학수번호 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on new search
              }}
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 dark:bg-gray-800/50 border border-gray-250 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Course Table representation */}
      <div className="relative overflow-x-auto border border-gray-100 dark:border-gray-800/80 rounded-xl">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-50/70 dark:bg-gray-800/40 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/80">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold text-center w-12">★</th>
              <th scope="col" className="px-4 py-3 font-semibold">학수번호</th>
              <th scope="col" className="px-4 py-3 font-semibold min-w-[200px]">교과목명</th>
              <th scope="col" className="px-4 py-3 font-semibold">이수구분</th>
              <th scope="col" className="px-4 py-3 font-semibold">소속 대학/학과</th>
              <th scope="col" className="px-4 py-3 font-semibold">담당교수</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">학점</th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">수강 / 정원</th>
              <th scope="col" className="px-4 py-3 font-semibold">수업방법</th>
              <th scope="col" className="px-4 py-3 font-semibold min-w-[150px]">시간표 / 강의실</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4 text-center"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-4 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-40" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-12" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-14" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-6 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-12 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-16" /></td>
                  <td className="px-4 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-28" /></td>
                </tr>
              ))
            ) : paginatedCourses.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                  {showOnlyFavorites ? '즐겨찾기한 강좌가 없습니다. 강좌 목록의 별표(★)를 눌러 추가해 보세요.' : '개설된 강좌 정보가 없습니다.'}
                </td>
              </tr>
            ) : (
              paginatedCourses.map((course) => {
                const isFull = course.enrolled >= course.capacity && course.capacity > 0;
                const isFav = favorites.includes(course.id);
                return (
                  <tr key={course.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10 transition-colors duration-150">
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleFavorite(course.id)}
                        className="p-1 hover:scale-110 active:scale-95 transition-all text-amber-400 dark:text-amber-500 focus:outline-none cursor-pointer"
                        title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                      >
                        <Star className={`h-4.5 w-4.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-gray-300 dark:text-gray-700'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {highlightText(course.code, searchTerm)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900 dark:text-white text-sm break-all leading-snug">
                      {highlightText(course.name, searchTerm)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        course.category.includes('전공') 
                          ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
                      }`}>
                        {course.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                      <div className="font-semibold text-gray-700 dark:text-gray-300">
                        {highlightText(course.college, searchTerm)}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {highlightText(course.department, searchTerm)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      {highlightText(course.professor, searchTerm)}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold text-gray-900 dark:text-white text-sm">
                      {course.credits}
                    </td>
                    <td className="px-4 py-3.5 text-center text-xs">
                      <div className={`font-bold text-sm ${isFull ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
                        {course.enrolled}명
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">정원 {course.capacity}명</div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {course.classType}
                    </td>
                    <td className="px-4 py-3.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                      {course.timetable ? (
                        <div className="flex items-start gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="break-all">{course.timetable}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">-</span>
                      )}
                      {course.classroom && (
                        <div className="flex items-start gap-1 mt-1 text-gray-500">
                          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="break-all">{course.classroom}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            총 {totalPages}페이지 중 {currentPage}페이지
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-3">
              {currentPage}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
