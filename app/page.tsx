import React from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { getCourseSidebarData } from '@/lib/supabase/queries';
import { CourseSidebarItem } from '@/types/course';

export const dynamic = 'force-dynamic';


export default async function Home() {
  let sidebarData: CourseSidebarItem[] = [];
  try {
    sidebarData = await getCourseSidebarData();
  } catch (error) {
    console.error('Failed to load sidebar data in page.tsx:', error);
  }

  return <DashboardShell initialSidebarData={sidebarData} />;
}

