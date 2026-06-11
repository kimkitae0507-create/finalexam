import { Course, CourseSidebarItem, SelectedMenu, CourseKPI, CourseChartData, CourseTableRow } from '@/types/course';
import { groupCoursesByCollege } from '../course-utils';
import { createAdminClient } from './server';

// Column names with parentheses must be double-quoted for PostgREST filter expressions
const COL_COLLEGE = '"대학(원)"';
const COL_DEPT = '"학과(부)"';

function getAdminClient() {
  return createAdminClient();
}

/**
 * Get all courses from the finalexam table
 */
export async function getAllCourses(): Promise<Course[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('finalexam')
    .select('*');

  if (error) {
    console.error('Error fetching all courses:', error);
    throw error;
  }
  return data as Course[];
}

/**
 * Get courses by college name
 */
export async function getCoursesByCollege(collegeName: string): Promise<Course[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('finalexam')
    .select('*')
    .filter(COL_COLLEGE, 'eq', collegeName);

  if (error) {
    console.error(`Error fetching courses for college ${collegeName}:`, error);
    throw error;
  }
  return data as Course[];
}

/**
 * Get courses by department name
 */
export async function getCoursesByDepartment(deptName: string): Promise<Course[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('finalexam')
    .select('*')
    .filter(COL_DEPT, 'eq', deptName);

  if (error) {
    console.error(`Error fetching courses for department ${deptName}:`, error);
    throw error;
  }
  return data as Course[];
}

/**
 * Fetch unique college/department columns and group them into CourseSidebarItem list
 */
export async function getCourseSidebarData(): Promise<CourseSidebarItem[]> {
  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from('finalexam')
    .select('*');

  if (error) {
    console.error('Failed to fetch sidebar course data:', error);
    throw error;
  }

  const formattedData = (data as any[])?.map((row) => ({
    '대학(원)': row['대학(원)'] as string | null,
    '학과(부)': row['학과(부)'] as string | null,
  })) || [];

  return groupCoursesByCollege(formattedData);
}

/**
 * Fetch courses based on SelectedMenu filter and calculate KPI statistics
 */
export async function getCourseKPIData(selectedItem: SelectedMenu): Promise<CourseKPI> {
  const { calculateKPI } = await import('../dashboard-utils');
  let courses: Course[] = [];

  if (!selectedItem) {
    courses = await getAllCourses();
  } else if (selectedItem.type === 'college') {
    courses = await getCoursesByCollege(selectedItem.name);
  } else if (selectedItem.type === 'department') {
    courses = await getCoursesByDepartment(selectedItem.name);
  }

  return calculateKPI(courses);
}

/**
 * Fetch courses based on SelectedMenu filter and calculate all chart data
 */
export async function getCourseChartData(selectedItem: SelectedMenu): Promise<CourseChartData> {
  const { calculateChartData } = await import('../dashboard-utils');
  let courses: Course[] = [];

  if (!selectedItem) {
    courses = await getAllCourses();
  } else if (selectedItem.type === 'college') {
    courses = await getCoursesByCollege(selectedItem.name);
  } else if (selectedItem.type === 'department') {
    courses = await getCoursesByDepartment(selectedItem.name);
  }

  return calculateChartData(courses);
}

/**
 * Fetch courses based on SelectedMenu filter and map to normalized Table Rows
 */
export async function getCourseTableData(selectedItem: SelectedMenu): Promise<CourseTableRow[]> {
  let raw: Course[] = [];

  if (!selectedItem) {
    raw = await getAllCourses();
  } else if (selectedItem.type === 'college') {
    raw = await getCoursesByCollege(selectedItem.name);
  } else if (selectedItem.type === 'department') {
    raw = await getCoursesByDepartment(selectedItem.name);
  }

  return raw.map((row) => ({
    id: String(row['순번'] || ''),
    code: String(row['학수번호'] || ''),
    name: String(row['교과목명'] || ''),
    category: String(row['이수구분'] || ''),
    college: String(row['대학(원)'] || ''),
    department: String(row['학과(부)'] || ''),
    professor: String(row['담당교수'] || ''),
    credits: Number(row['학점']) || 0,
    enrolled: Number(row['수강']) || 0,
    capacity: Number(row['정원']) || 0,
    classType: String(row['수업유형'] || ''),
    timetable: String(row['시간표(시간)'] || ''),
    classroom: String(row['강의실'] || ''),
  }));
}
