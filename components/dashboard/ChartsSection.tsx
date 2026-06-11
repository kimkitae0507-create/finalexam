'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CourseChartData, SelectedMenu, ChartItem } from '@/types/course';

interface ChartsSectionProps {
  selectedItem: SelectedMenu;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#374151', '#06b6d4'];

function ChartCard({
  title,
  children,
  loading,
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-all duration-200">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">{title}</h3>
      <div className="h-[260px] w-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-xs text-gray-400">데이터를 로드하는 중...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export default function ChartsSection({ selectedItem }: ChartsSectionProps) {
  const [data, setData] = useState<CourseChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({ action: 'chart' });
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
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError('차트 데이터를 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedItem]);


  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  // Helper to check if data is empty
  const isEmpty = (arr?: ChartItem[]) => !arr || arr.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. 이수구분별 강좌수 */}
      <ChartCard title="이수구분별 강좌 수" loading={loading}>
        {!loading && data && !isEmpty(data.coursesByCategory) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.coursesByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>

      {/* 2. 이수구분별 평균 수강인원 */}
      <ChartCard title="이수구분별 평균 수강인원 (명)" loading={loading}>
        {!loading && data && !isEmpty(data.avgStudentsByCategory) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.avgStudentsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>

      {/* 3. 수업방법 유형 분포 */}
      <ChartCard title="수업유형 분포" loading={loading}>
        {!loading && data && !isEmpty(data.classTypeDistribution) ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.classTypeDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.classTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>

      {/* 4. 학점 구성 비율 */}
      <ChartCard title="학점 구성 비율" loading={loading}>
        {!loading && data && !isEmpty(data.creditDistribution) ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.creditDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.creditDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>

      {/* 5. 요일별 수업 강좌 수 */}
      <ChartCard title="요일별 수업 강좌 수" loading={loading}>
        {!loading && data && !isEmpty(data.coursesByDayOfWeek) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.coursesByDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>

      {/* 6. 수업 시간별 강좌 수 */}
      <ChartCard title="시간대별 수업 강좌 수" loading={loading}>
        {!loading && data && !isEmpty(data.coursesByTimeSlot) ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.coursesByTimeSlot} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400">데이터가 없습니다.</p>
        )}
      </ChartCard>
    </div>
  );
}
