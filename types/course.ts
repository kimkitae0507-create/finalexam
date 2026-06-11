export interface Course {
  순번: string;
  학기: string;
  "대학(원)": string;
  "학과(부)": string;
  학년: string;
  이수구분: string;
  이수영역: string;
  학수번호: string;
  교과목명: string;
  "교과목명(영문)": string;
  담당교수: string;
  소속: string;
  강의실: string | null;
  "시간표(교시)": string | null;
  "시간표(시간)": string | null;
  교시유형: string | null;
  학점: number;
  시수: number;
  이론: number;
  실습: number;
  정원: number;
  수강: number;
  "수강(남)": number;
  "수강(여)": number;
  재수강: number;
  수업구분: string | null;
  수업유형: string | null;
  집중이수제: string | null;
  성적평가: string | null;
  원어강의: string | null;
  원어강의구분: string | null;
  원어강사료지급: string | null;
  캡스톤디자인: string | null;
  수강대상: string | null;
  수업방법: string | null;
  비고: string | null;
}

export interface CourseSidebarItem {
  college: string;
  departments: string[];
}

export type SelectedMenu =
  | { type: 'college'; name: string }
  | { type: 'department'; name: string; college: string }
  | null;

export interface CourseKPI {
  totalCourses: number;
  totalStudents: number;
  averageEnrollmentRate: number;
  englishLectureRatio: number;
}

/** Generic key-value pair for bar/pie charts */
export interface ChartItem {
  name: string;
  value: number;
}

/** All chart datasets bundled together */
export interface CourseChartData {
  /** 이수구분별 강좌 수 (bar) */
  coursesByCategory: ChartItem[];
  /** 이수구분별 평균 수강인원 (bar) */
  avgStudentsByCategory: ChartItem[];
  /** 수업유형 분포 (pie/donut) */
  classTypeDistribution: ChartItem[];
  /** 학점 구성 비율 (pie/donut) */
  creditDistribution: ChartItem[];
  /** 요일별 강좌 수 (bar) */
  coursesByDayOfWeek: ChartItem[];
  /** 수업 시간대별 강좌 수 (bar) */
  coursesByTimeSlot: ChartItem[];
}

export interface CourseTableRow {
  id: string;          // 순번
  code: string;        // 학수번호
  name: string;        // 교과목명
  category: string;    // 이수구분
  college: string;     // 대학
  department: string;  // 학과
  professor: string;   // 담당교수
  credits: number;     // 학점
  enrolled: number;    // 수강인원
  capacity: number;    // 정원
  classType: string;   // 수업방법
  timetable: string;   // 강의시간
  classroom: string;   // 강의실
}

