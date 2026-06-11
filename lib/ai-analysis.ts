import { GoogleGenerativeAI } from '@google/generative-ai';
import { Course, SelectedMenu } from '@/types/course';

const MODEL_NAME = 'gemini-3.1-flash-lite';

// ────────────────────────────────────────────────
// 1. 데이터 요약 유틸
// ────────────────────────────────────────────────

interface CourseSummary {
  target: string;          // 분석 대상 (대학명 또는 학과명)
  totalCourses: number;
  totalEnrolled: number;
  avgEnrollmentRate: number; // 평균 수강률 (%)

  /** 이수구분별 강좌수 */
  categoryDist: Record<string, number>;

  /** 학점별 강좌수 */
  creditsDist: Record<string, number>;

  /** 수업유형별 강좌수 */
  classTypeDist: Record<string, number>;

  /** 요일별 강좌수 (월~토) */
  dayDist: Record<string, number>;

  /** 시간대별 강좌수 (오전/오후/저녁) */
  timeDist: Record<string, number>;

  /** 수강인원 상위 5개 강좌 */
  topEnrolledCourses: { name: string; enrolled: number; professor: string }[];

  /** 수강인원 하위 5개 강좌 (수강인원 > 0) */
  lowEnrolledCourses: { name: string; enrolled: number; capacity: number }[];

  /** 원어강의 수 */
  englishCount: number;
}

function buildSummary(courses: Course[], target: string): CourseSummary {
  const totalCourses = courses.length;
  const totalEnrolled = courses.reduce((s, c) => s + (Number(c['수강']) || 0), 0);
  const totalCapacity = courses.reduce((s, c) => s + (Number(c['정원']) || 0), 0);
  const avgEnrollmentRate = totalCapacity > 0
    ? Math.round((totalEnrolled / totalCapacity) * 100)
    : 0;

  // 이수구분 분포
  const categoryDist: Record<string, number> = {};
  courses.forEach((c) => {
    const k = String(c['이수구분'] || '기타');
    categoryDist[k] = (categoryDist[k] || 0) + 1;
  });

  // 학점 분포
  const creditsDist: Record<string, number> = {};
  courses.forEach((c) => {
    const k = `${Number(c['학점']) || 0}학점`;
    creditsDist[k] = (creditsDist[k] || 0) + 1;
  });

  // 수업유형 분포
  const classTypeDist: Record<string, number> = {};
  courses.forEach((c) => {
    const raw = String(c['수업유형'] || '');
    // 괄호 앞부분만 추출: "대면수업(이러닝)" → "대면수업"
    const k = raw.split('(')[0].trim() || '기타';
    classTypeDist[k] = (classTypeDist[k] || 0) + 1;
  });

  // 요일 분포 (시간표(교시)에서 추출)
  const DAY_PATTERN = /[월화수목금토]/g;
  const dayDist: Record<string, number> = { 월: 0, 화: 0, 수: 0, 목: 0, 금: 0, 토: 0 };
  courses.forEach((c) => {
    const timetable = String(c['시간표(교시)'] || '');
    const days = timetable.match(DAY_PATTERN) || [];
    const unique = [...new Set(days)];
    unique.forEach((d) => { dayDist[d] = (dayDist[d] || 0) + 1; });
  });

  // 시간대 분포 (시간표(시간) 첫 시작 시간 기준)
  const timeDist: Record<string, number> = { 오전: 0, 오후: 0, 저녁: 0, 미정: 0 };
  const TIME_PATTERN = /(\d{1,2}):(\d{2})/;
  courses.forEach((c) => {
    const timetable = String(c['시간표(시간)'] || '');
    const m = timetable.match(TIME_PATTERN);
    if (!m) { timeDist['미정']++; return; }
    const hour = parseInt(m[1], 10);
    if (hour < 12) timeDist['오전']++;
    else if (hour < 18) timeDist['오후']++;
    else timeDist['저녁']++;
  });

  // 수강인원 상위 5개
  const sorted = [...courses].sort(
    (a, b) => (Number(b['수강']) || 0) - (Number(a['수강']) || 0)
  );
  const topEnrolledCourses = sorted.slice(0, 5).map((c) => ({
    name: String(c['교과목명'] || ''),
    enrolled: Number(c['수강']) || 0,
    professor: String(c['담당교수'] || ''),
  }));

  // 수강인원 하위 5개 (수강인원 > 0)
  const withEnrolled = courses.filter((c) => (Number(c['수강']) || 0) > 0);
  const lowSorted = [...withEnrolled].sort(
    (a, b) => (Number(a['수강']) || 0) - (Number(b['수강']) || 0)
  );
  const lowEnrolledCourses = lowSorted.slice(0, 5).map((c) => ({
    name: String(c['교과목명'] || ''),
    enrolled: Number(c['수강']) || 0,
    capacity: Number(c['정원']) || 0,
  }));

  // 원어강의 수
  const englishCount = courses.filter(
    (c) => String(c['원어강의'] || '').trim().toLowerCase() === 'y'
  ).length;

  return {
    target,
    totalCourses,
    totalEnrolled,
    avgEnrollmentRate,
    categoryDist,
    creditsDist,
    classTypeDist,
    dayDist,
    timeDist,
    topEnrolledCourses,
    lowEnrolledCourses,
    englishCount,
  };
}

// ────────────────────────────────────────────────
// 2. 프롬프트 생성
// ────────────────────────────────────────────────

function buildPrompt(summary: CourseSummary): string {
  const topList = summary.topEnrolledCourses
    .map((c, i) => `  ${i + 1}. ${c.name} (${c.enrolled}명, 담당: ${c.professor})`)
    .join('\n');

  const lowList = summary.lowEnrolledCourses
    .map((c, i) => `  ${i + 1}. ${c.name} (${c.enrolled}/${c.capacity}명)`)
    .join('\n');

  const catLines = Object.entries(summary.categoryDist)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  - ${k}: ${v}강좌`)
    .join('\n');

  const creditLines = Object.entries(summary.creditsDist)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  - ${k}: ${v}강좌`)
    .join('\n');

  const classTypeLines = Object.entries(summary.classTypeDist)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `  - ${k}: ${v}강좌`)
    .join('\n');

  const dayLines = Object.entries(summary.dayDist)
    .map(([k, v]) => `  - ${k}요일: ${v}강좌`)
    .join('\n');

  const timeLines = Object.entries(summary.timeDist)
    .map(([k, v]) => `  - ${k}: ${v}강좌`)
    .join('\n');

  return `당신은 대학교 강의 데이터를 분석하는 전문가입니다.
아래는 인천대학교 2026-1학기 "${summary.target}"의 강의 통계 데이터입니다.

## 기본 현황
- 전체 강좌수: ${summary.totalCourses}개
- 전체 수강인원: ${summary.totalEnrolled}명
- 평균 수강률: ${summary.avgEnrollmentRate}%
- 원어강의 수: ${summary.englishCount}개 (${summary.totalCourses > 0 ? Math.round(summary.englishCount / summary.totalCourses * 100) : 0}%)

## 이수구분 분포
${catLines}

## 학점 구성
${creditLines}

## 수업방법 유형 분포
${classTypeLines}

## 요일별 강좌수
${dayLines}

## 시간대별 강좌수
${timeLines}

## 수강인원 상위 5개 강좌
${topList}

## 수강인원 하위 5개 강좌 (미달 포함)
${lowList}

---

위 데이터를 바탕으로 다음 항목을 포함한 분석 보고서를 **한국어 Markdown 형식**으로 작성해 주세요.
각 항목은 ## 제목으로 구분하고, 구체적인 수치를 활용해 작성하세요.

1. 전체 강좌 현황 요약
2. 이수구분 분포 분석
3. 수강인원 특징 분석 (인기 강좌/미달 강좌 포함)
4. 수업방법 특징 분석
5. 학점 분포 특징
6. 요일·시간대 특징
7. 운영상 강점
8. 개선 제안 (2~3가지)
9. 종합 결론

분석 보고서는 실무에서 활용할 수 있도록 구체적이고 통찰력 있게 작성해 주세요.`;
}

// ────────────────────────────────────────────────
// 3. Gemini 호출
// ────────────────────────────────────────────────

export async function generateAIAnalysis(
  courses: Course[],
  selectedMenu: SelectedMenu
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요.');
  }

  if (courses.length === 0) {
    throw new Error('분석할 강좌 데이터가 없습니다.');
  }

  // 분석 대상 이름 결정
  const target = selectedMenu
    ? selectedMenu.type === 'department'
      ? `${selectedMenu.college ?? ''} ${selectedMenu.name}`.trim()
      : selectedMenu.name
    : '전체 대학';

  const summary = buildSummary(courses, target);
  const prompt = buildPrompt(summary);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error('Gemini API가 빈 응답을 반환했습니다.');
  }

  return text;
}
