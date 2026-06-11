import { CourseSidebarItem } from '@/types/course';

/**
 * Clean up text by removing extra spaces, null, or undefined values.
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text.trim();
}

/**
 * Sorts colleges based on INU's specific requirements, and falling back to Korean alphabetical sort.
 */
export function sortCollegesByInuOrder(items: CourseSidebarItem[]): CourseSidebarItem[] {
  const inuOrder = [
    '기초교육원',
    '인문대학',
    '자연과학대학',
    '사회과학대학',
    '글로벌정경대학',
    '공과대학',
    '정보기술대학',
    '경영대학',
    '예술체육대학',
    '사범대학',
    '도시과학대학',
    '생명과학기술대학',
    '동북아국제통상물류학부',
    '법학부',
    '자유전공학부',
    '대학원'
  ];

  return [...items].sort((a, b) => {
    const aIndex = inuOrder.indexOf(a.college);
    const bIndex = inuOrder.indexOf(b.college);

    // If both are in the specified order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // If only 'a' is in the specified order, it comes first
    if (aIndex !== -1) return -1;
    // If only 'b' is in the specified order, it comes first
    if (bIndex !== -1) return 1;

    // Fallback: alphabetical sorting for colleges not in the preset list
    return a.college.localeCompare(b.college, 'ko');
  });
}

/**
 * Group raw course data by college and departments.
 */
export function groupCoursesByCollege(
  data: { '대학(원)': string | null; '학과(부)': string | null }[]
): CourseSidebarItem[] {
  const collegeMap: Record<string, Set<string>> = {};

  data.forEach((row) => {
    const rawCollege = row['대학(원)'];
    const rawDept = row['학과(부)'];

    const college = normalizeText(rawCollege);
    const dept = normalizeText(rawDept);

    if (college && dept) {
      if (!collegeMap[college]) {
        collegeMap[college] = new Set<string>();
      }
      collegeMap[college].add(dept);
    }
  });

  const sidebarItems: CourseSidebarItem[] = Object.entries(collegeMap).map(([college, deptsSet]) => ({
    college,
    departments: Array.from(deptsSet).sort((a, b) => a.localeCompare(b, 'ko')),
  }));

  return sortCollegesByInuOrder(sidebarItems);
}
