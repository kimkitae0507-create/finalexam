'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Users, TrendingUp, Globe } from 'lucide-react';
import { CourseKPI, SelectedMenu } from '@/types/course';

interface KpiCardsProps {
  selectedItem: SelectedMenu;
}

const CARD_CONFIG = [
  {
    key: 'totalCourses' as keyof CourseKPI,
    title: '총 강좌 수',
    icon: BookOpen,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    format: (v: number) => `${v.toLocaleString()}개`,
  },
  {
    key: 'totalStudents' as keyof CourseKPI,
    title: '총 수강인원',
    icon: Users,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    format: (v: number) => `${v.toLocaleString()}명`,
  },
  {
    key: 'averageEnrollmentRate' as keyof CourseKPI,
    title: '평균 수강률',
    icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    format: (v: number) => `${v.toFixed(1)}%`,
  },
  {
    key: 'englishLectureRatio' as keyof CourseKPI,
    title: '원어강의 비율',
    icon: Globe,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    format: (v: number) => `${v.toFixed(1)}%`,
  },
];

export default function KpiCards({ selectedItem }: KpiCardsProps) {
  const [kpi, setKpi] = useState<CourseKPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ action: 'kpi' });
    if (selectedItem) {
      params.append('type', selectedItem.type);
      params.append('name', selectedItem.name);
      if (selectedItem.type === 'department' && 'college' in selectedItem) {
        params.append('college', selectedItem.college);
      }
    }

    fetch(`/api/course?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setKpi(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedItem]);


  if (error) {
    return (
      <div className="col-span-4 text-center text-sm text-red-500 dark:text-red-400 py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARD_CONFIG.map(({ key, title, icon: Icon, color, bg, format }) => (
        <div
          key={key}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>

          {loading ? (
            <div className="h-9 w-28 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse mt-1" />
          ) : (
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {kpi ? format(kpi[key] as number) : '-'}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
