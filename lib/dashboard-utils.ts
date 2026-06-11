import { Course, CourseKPI, CourseChartData, ChartItem } from '@/types/course';

/**
 * Calculate KPI metrics from a list of courses.
 */
export function calculateKPI(courses: Course[]): CourseKPI {
  const totalCourses = courses.length;
  if (totalCourses === 0) {
    return {
      totalCourses: 0,
      totalStudents: 0,
      averageEnrollmentRate: 0,
      englishLectureRatio: 0,
    };
  }

  let totalStudents = 0;
  let enrollmentRateSum = 0;
  let validCapacityCoursesCount = 0;
  let englishCoursesCount = 0;

  courses.forEach((course) => {
    // 1. Sum up total students
    totalStudents += course.수강 || 0;

    // 2. Accumulate enrollment rate (avoid division by 0)
    const capacity = course.정원 || 0;
    const enrolled = course.수강 || 0;
    if (capacity > 0) {
      enrollmentRateSum += (enrolled / capacity) * 100;
      validCapacityCoursesCount++;
    }

    // 3. Count English (foreign language) lectures
    if (course.원어강의 === 'Y') {
      englishCoursesCount++;
    }
  });

  const averageEnrollmentRate =
    validCapacityCoursesCount > 0 ? enrollmentRateSum / validCapacityCoursesCount : 0;
  const englishLectureRatio = (englishCoursesCount / totalCourses) * 100;

  return {
    totalCourses,
    totalStudents,
    averageEnrollmentRate: Math.round(averageEnrollmentRate * 10) / 10,
    englishLectureRatio: Math.round(englishLectureRatio * 10) / 10,
  };
}

// ─────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────

/** Group values and count occurrences, returns sorted descending */
function countByKey<T>(
  items: T[],
  getKey: (item: T) => string | null | undefined
): ChartItem[] {
  const map: Record<string, number> = {};
  items.forEach((item) => {
    const key = getKey(item)?.trim();
    if (key) map[key] = (map[key] ?? 0) + 1;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Extract all unique days of the week that appear in 시간표(시간) strings.
 * Format: " [room:월(09:00~10:15),화(09:00~10:15)]"
 * Korean day characters: 월 화 수 목 금 토 일
 */
function parseDays(timetable: string | null | undefined): string[] {
  if (!timetable) return [];
  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
  const found = new Set<string>();
  // Match day characters that precede a parenthesis (e.g. 월(...)
  const matches = timetable.matchAll(/([월화수목금토일])(?=\()/g);
  for (const m of matches) found.add(m[1]);
  return Array.from(found).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
}

/**
 * Classify the first start time into 시간대 buckets:
 * 오전 09~12시 / 12~15시 / 15~18시 / 18시 이후(야간)
 */
function classifyTimeSlot(timetable: string | null | undefined): string | null {
  if (!timetable) return null;
  // Find first HH:MM pattern
  const match = timetable.match(/(\d{2}):(\d{2})/);
  if (!match) return null;
  const hour = parseInt(match[1], 10);
  if (hour >= 9 && hour < 12) return '오전 9-12시';
  if (hour >= 12 && hour < 15) return '12-15시';
  if (hour >= 15 && hour < 18) return '15-18시';
  if (hour >= 18) return '18시 이후(야간)';
  return '9시 이전';
}

// ─────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────

/**
 * Compute all 6 chart datasets from a list of courses.
 */
export function calculateChartData(courses: Course[]): CourseChartData {
  if (courses.length === 0) {
    const empty: ChartItem[] = [];
    return {
      coursesByCategory: empty,
      avgStudentsByCategory: empty,
      classTypeDistribution: empty,
      creditDistribution: empty,
      coursesByDayOfWeek: empty,
      coursesByTimeSlot: empty,
    };
  }

  // ── 1. 이수구분별 강좌 수 ──────────────────────────────────────────
  const coursesByCategory = countByKey(courses, (c) => c.이수구분);

  // ── 2. 이수구분별 평균 수강인원 ────────────────────────────────────
  const categoryStudentMap: Record<string, number[]> = {};
  courses.forEach((c) => {
    const cat = c.이수구분?.trim();
    if (cat) {
      if (!categoryStudentMap[cat]) categoryStudentMap[cat] = [];
      categoryStudentMap[cat].push(c.수강 || 0);
    }
  });
  const avgStudentsByCategory: ChartItem[] = Object.entries(categoryStudentMap)
    .map(([name, vals]) => ({
      name,
      value: Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10,
    }))
    .sort((a, b) => b.value - a.value);

  // ── 3. 수업유형 분포 ───────────────────────────────────────────────
  const classTypeDistribution = countByKey(courses, (c) => c.수업유형);

  // ── 4. 학점 구성 비율 ──────────────────────────────────────────────
  const creditDistribution = countByKey(courses, (c) =>
    c.학점 != null ? `${c.학점}학점` : null
  );

  // ── 5. 요일별 강좌 수 ──────────────────────────────────────────────
  const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];
  const dayMap: Record<string, number> = {};
  courses.forEach((c) => {
    const days = parseDays(c['시간표(시간)']);
    // Count each course once per unique day it appears on
    const uniqueDays = [...new Set(days)];
    uniqueDays.forEach((d) => { dayMap[d] = (dayMap[d] ?? 0) + 1; });
  });
  const coursesByDayOfWeek: ChartItem[] = dayOrder
    .filter((d) => dayMap[d] !== undefined)
    .map((d) => ({ name: d, value: dayMap[d] }));

  // ── 6. 수업 시간대별 강좌 수 ───────────────────────────────────────
  const slotOrder = ['오전 9-12시', '12-15시', '15-18시', '18시 이후(야간)', '9시 이전'];
  const slotMap: Record<string, number> = {};
  courses.forEach((c) => {
    const slot = classifyTimeSlot(c['시간표(시간)']);
    if (slot) slotMap[slot] = (slotMap[slot] ?? 0) + 1;
  });
  const coursesByTimeSlot: ChartItem[] = slotOrder
    .filter((s) => slotMap[s] !== undefined)
    .map((s) => ({ name: s, value: slotMap[s] }));

  return {
    coursesByCategory,
    avgStudentsByCategory,
    classTypeDistribution,
    creditDistribution,
    coursesByDayOfWeek,
    coursesByTimeSlot,
  };
}

