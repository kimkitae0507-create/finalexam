### 터미널을 열고 코드 베이스 구성

> npx create-next-app@latest .

---

### supabase 연결을 위한 패키지 설치

> npm install @supabase/supabase-js @supabase/ssr

---

### supabase 키를 .env.local 파일에 등록

> NEXT_PUBLIC_SUPABASE_URL=https://htfipcrgikfyocnspbxr.supabase.co
> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_aooWGCKevT_EbIYP4RWqNA_gflLZzeM
> NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmlwY3JnaWtmeW9jbnNwYnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNzMzMjksImV4cCI6MjA5Njc0OTMyOX0.SPnXEl0LdSowAISHc-xcUB6V8XbBZk7MdhICCJ9ElDo
> SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZmlwY3JnaWtmeW9jbnNwYnhyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE3MzMyOSwiZXhwIjoyMDk2NzQ5MzI5fQ.BEaGnk1PVtwx0lg3LeIJMtBcsGrRPKLwppB1_2Wj0nQ


# 1단계: 프로젝트 기본 골격 생성

이번 단계에서는 전체 기능을 한 번에 구현하지 말고,  
프로젝트의 기본 구조와 화면 레이아웃만 먼저 만들어라.

---

## 프로젝트 이름

inu-course-dashboard

---

## 기술 스택

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Lucide React
- Recharts
- Supabase

---

## 이번 단계 목표

아직 Supabase 연결, CSV 데이터 조회, 차트, AI 분석 기능은 구현하지 않는다.

이번 단계에서는 다음만 구현한다.

1. 전체 레이아웃 구성
2. Header 구성
3. Sidebar 구성
4. Main Dashboard 기본 화면 구성
5. Footer 구성
6. 기본 폴더 구조 정리

---

## 화면 구성

전체 화면은 다음 구조로 만든다.

- Header
- Sidebar
- Main Content
- Footer

반응형 디자인을 적용한다.

---

## Header 요구사항

Header에는 다음 제목을 표시한다.

인천대학교 2026-1학기 전체 교과목 대시보드

우측에는 다크모드 토글 버튼을 넣는다.

---

## Sidebar 요구사항

왼쪽 사이드바를 만든다.

현재는 Supabase 데이터가 없으므로 더미 데이터를 사용한다.

더미 데이터 예시는 다음과 같다.

- 공과대학
  - 컴퓨터공학부
  - 전기공학과

- 자연과학대학
  - 물리학과
  - 수학과

- 인문대학
  - 국어국문학과
  - 영어영문학과

모든 대학과 학과 메뉴는 처음부터 펼쳐진 상태로 보이게 한다.

대학 또는 학과를 클릭하면 선택 상태가 표시되도록 한다.

---

## Main Content 요구사항

초기 화면에는 다음 문구를 중앙에 표시한다.

대학 또는 학과를 선택하세요.

Sidebar에서 대학 또는 학과를 클릭하면 다음과 같이 표시한다.

선택한 항목: [선택한 이름]

---

## Footer 요구사항

Footer에는 다음 링크를 넣는다.

- 인천대학교 홈페이지: https://www.inu.ac.kr
- INU 포털: https://portal.inu.ac.kr
- 이러닝: https://cyber.inu.ac.kr

Footer 오른쪽에는 다음 문구를 표시한다.

제작자: 김기태

---

## 디자인 요구사항

- 깔끔한 대시보드 스타일
- 흰색/회색 기반
- 카드형 레이아웃
- 다크모드 대응
- 모바일에서도 깨지지 않게 구성
- 사이드바는 데스크톱에서는 왼쪽 고정
- 모바일에서는 상단 또는 접이식 형태로 자연스럽게 표시

---

## 폴더 구조

다음과 같은 구조를 권장한다.

app/
components/
components/layout/
components/sidebar/
components/dashboard/
lib/
types/

---

## 코드 작성 규칙

- TypeScript를 사용한다.
- 컴포넌트를 기능별로 분리한다.
- 재사용 가능한 구조로 작성한다.
- 불필요하게 복잡한 코드는 피한다.
- 주석을 적절히 추가한다.
- 실행 가능한 완성 코드로 작성한다.
- 누락된 파일이 없도록 전체 파일 코드를 제공한다.

---

## 출력 형식

다음 순서로 답변하라.

1. 설치해야 할 패키지 명령어
2. 생성/수정해야 할 파일 목록
3. 각 파일의 전체 코드
4. 실행 방법
5. 다음 단계에서 해야 할 작업 요약

---

### 2단계: Supabase 연결

supabase 초기화 파일 제작

프롬프트:

1. 필요한 파일
> lib/supabase/server.ts : 서버 컴포넌트용 supabase 클라이언트 (createClient)
> lib/supabase/client.ts : 클라이언트 컴포넌트용 supabase 클라이언트 (createClient)

2. 아래 패키지가 이미 설치됨
> @supabase/supabase-js
> @supabase/ssr

3. 환경변수에 supabase 키가 추가되어 있음
> NEXT_PUBLIC_SUPABASE_URL
> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
> NEXT_PUBLIC_SUPABASE_ANON_KEY
> SUPABASE_SERVICE_ROLE_KEY

이외 화면이나 로직은 수정하지 말고, 필요한 초기화 코드만 작성

---

### supabase 연결 확인

프롬프트:

> supabase 연결을 확인하고 등록된 테이블 정보를 알려줘
> 테이블 정보를 자세히 알려줘

---

### supabase 최신 정책 반영 (반드시 적용, 그대로 사용)

프롬프트:

앞으로 테이블을 생성할 때와 액세스할 때 아래 사항을 항상 적용하도록 AGENTS.md에 반영하자.

> anon과 authenticated 역할(Role)이 PostgREST API를 통해 이 테이블에 접근할 수 있도록 명시적인 GRANT SQL 문(SELECT, INSERT, UPDATE, DELETE 등)을 반드시 포함해 줘.

> 또한, RLS(Row Level Security)를 활성화하고, 인증된 유저(authenticated)만 본인의 일기를 읽고 쓸 수 있도록 Policy도 함께 작성해 줘.

---

Supabase에 업로드된 교과목 테이블을 조회해서 연결 상태를 확인하자.

요구사항:

1. 현재 Supabase에 존재하는 교과목 관련 테이블을 확인한다.
2. 교과목 테이블의 컬럼명을 확인한다.
3. 전체 행 개수를 조회한다.
4. 행 개수가 2,313개인지 확인한다.
5. 샘플 데이터 5개를 조회한다.
6. 조회 결과를 바탕으로 TypeScript 타입을 types/course.ts에 정의한다.
7. 화면 UI는 아직 수정하지 않는다.
8. 필요한 경우 lib/supabase/queries.ts 파일을 만들어 데이터 조회 함수만 작성한다.

출력 형식:

1. 확인한 테이블명
2. 컬럼 목록
3. 전체 행 개수
4. 샘플 데이터
5. 생성/수정한 파일 코드

# 3-1단계: Supabase 테이블 구조 확인 및 Sidebar 데이터 조회 함수 작성

현재 프로젝트에는 다음이 이미 완료되어 있다.

- Supabase 환경변수 설정 완료
- lib/supabase/client.ts 생성 완료
- lib/supabase/server.ts 생성 완료
- Supabase 연결 확인 완료
- 교과목 CSV 데이터 업로드 완료

이번 단계에서는 화면 UI를 수정하지 않는다.

목표는 Supabase 교과목 테이블 구조를 확인하고,
Sidebar 생성을 위한 데이터 조회 함수와 타입만 작성하는 것이다.

==================================================
이번 단계 목표
==================================================

1. Supabase에 존재하는 교과목 관련 테이블명을 확인한다.
2. 해당 테이블의 컬럼명을 확인한다.
3. 대학/학부/단과대학에 해당하는 컬럼명을 찾는다.
4. 학과/개설학과/학과명에 해당하는 컬럼명을 찾는다.
5. Sidebar 생성을 위한 타입을 작성한다.
6. 대학/학과 데이터를 그룹화하는 유틸 함수를 작성한다.
7. Supabase에서 대학/학과 컬럼만 조회하는 함수를 작성한다.

==================================================
중요
==================================================

이번 단계에서는 화면 컴포넌트를 수정하지 않는다.

수정 금지:

- app/page.tsx
- components/sidebar/*
- components/dashboard/*
- Header
- Footer
- Layout

이번 단계에서는 데이터 준비 코드만 작성한다.

==================================================
대학 정렬 순서
==================================================

대학은 아래 순서대로 정렬한다.

1. 인문대학
2. 자연과학대학
3. 사회과학대학
4. 글로벌정경대학
5. 공과대학
6. 정보기술대학
7. 경영대학
8. 예술체육대학
9. 사범대학
10. 도시과학대학
11. 생명과학기술대학
12. 동북아국제통상물류학부
13. 법학부
14. 자유전공학부
15. 대학원

위 목록에 없는 대학은 뒤에 가나다순으로 정렬한다.

==================================================
생성 또는 수정할 파일
==================================================

1. types/course.ts

교과목 데이터 타입과 Sidebar 관련 타입을 정의한다.

필요 타입 예시:

- Course
- CourseSidebarItem
- SelectedMenu

2. lib/course-utils.ts

대학/학과 그룹핑 함수를 작성한다.

필수 함수:

- normalizeText
- groupCoursesByCollege
- sortCollegesByInuOrder

기능:

- null 제거
- undefined 제거
- 공백 제거
- 중복 학과 제거
- 대학별 학과 그룹화
- 지정된 대학 순서대로 정렬
- 지정 순서에 없는 대학은 가나다순으로 뒤에 배치

3. lib/supabase/queries.ts

Supabase 조회 함수를 작성한다.

필수 함수:

- getCourseSidebarData

기능:

- 교과목 테이블에서 대학/학과 컬럼만 조회
- 조회 실패 시 에러 처리
- lib/course-utils.ts의 그룹핑 함수 사용
- 최종적으로 CourseSidebarItem[] 반환

==================================================
컬럼명 처리
==================================================

교과목 테이블의 실제 컬럼명을 확인한 뒤 사용한다.

대학 컬럼 후보:

- 대학
- 단과대학
- 대학명
- 개설대학
- 학부

학과 컬럼 후보:

- 학과
- 개설학과
- 학과명
- 개설학과명
- 주관학과

컬럼명이 다르면 실제 컬럼명에 맞게 코드에 반영한다.

==================================================
주의사항
==================================================

- Supabase 환경변수는 수정하지 않는다.
- lib/supabase/client.ts는 수정하지 않는다.
- lib/supabase/server.ts는 필요한 경우에만 최소 수정한다.
- UI 컴포넌트는 절대 수정하지 않는다.
- 아직 Sidebar 화면 출력은 구현하지 않는다.
- 아직 차트, KPI, AI 분석은 구현하지 않는다.
- TypeScript 오류가 없도록 작성한다.

==================================================
출력 형식
==================================================

다음 순서로 답변하라.

1. 확인한 교과목 테이블명
2. 확인한 대학 컬럼명
3. 확인한 학과 컬럼명
4. 생성/수정한 파일 목록
5. 정상 작동 확인 방법
6. 다음 단계에서 해야 할 작업

# 3-2단계: Sidebar UI 연결

목표:
3-1단계에서 만든 getCourseSidebarData를 사용해 기존 더미 Sidebar를 Supabase 데이터 기반으로 교체한다.

현재 상태:
- types/course.ts 있음
- lib/course-utils.ts 있음
- lib/supabase/queries.ts에 getCourseSidebarData 있음
- Sidebar는 아직 더미 데이터 사용 중

작업:
1. 기존 Sidebar 더미 데이터 제거
2. getCourseSidebarData로 대학/학과 목록 불러오기
3. 모든 대학 메뉴 기본 펼침
4. 대학/학과 클릭 가능
5. 선택 항목 강조
6. 선택 결과를 Main Content에 표시
7. 필요하면 DashboardShell 같은 클라이언트 컴포넌트 생성

선택 타입:
SelectedMenu =
| { type: "college"; name: string }
| { type: "department"; name: string; college: string }
| null

Main 표시:
선택 전: 대학 또는 학과를 선택하세요.
선택 후: 선택한 항목 : [이름]

주의:
- Header/Footer/Layout 유지
- Supabase 초기화 파일 수정 금지
- KPI/차트/AI 구현 금지
- 다크모드/반응형 유지
- 데이터 없거나 오류 시 메시지 표시

출력 규칙:
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일 수정 시 변경 부분만 Before/After로 출력
- 수정한 파일명과 변경 이유만 간단히 보고
- 실행/확인 방법은 짧게 작성


# 4-1단계: KPI 데이터 계산 로직 작성

목표:
선택한 대학 또는 학과 기준으로 대시보드 상단 KPI 카드에 사용할 통계 데이터를 계산한다.

현재 상태:
- Supabase 연결 완료
- Sidebar 데이터 자동 생성 완료
- 대학/학과 선택 기능 완료
- 선택 결과 Main Content 표시 완료

이번 단계에서는 UI 카드를 만들지 않는다.
KPI 계산 함수와 타입만 작성한다.

작업:
1. 선택된 대학/학과 기준으로 교과목 데이터 조회
2. 총 강좌수 계산
3. 총 수강인원 계산
4. 평균 수강률 계산
5. 원어 강의 비율 계산
6. KPI 타입 정의
7. KPI 조회 함수 작성

필요 KPI:
- 총 강좌수
- 총 수강인원
- 평균 수강률
- 원어 강의 비율

컬럼명은 실제 Supabase 테이블 컬럼명을 확인해서 사용한다.

예상 컬럼 후보:
- 강좌수: 행 개수 기준
- 수강인원: 수강인원, 수강인원수, 신청인원, 수강생수
- 수강정원: 수강정원, 정원
- 수강률: 수강률 컬럼이 있으면 사용, 없으면 수강인원 / 수강정원 * 100
- 원어강의: 원어강의, 원어, 강의언어, 영어강의여부

수정 가능 파일:
- types/course.ts
- lib/supabase/queries.ts
- 필요 시 lib/dashboard-utils.ts 생성

주의:
- UI 파일 수정 금지
- Sidebar 수정 금지
- Header/Footer/Layout 수정 금지
- 차트/AI 구현 금지
- null, undefined, 0 나누기 안전 처리
- 선택값이 null이면 전체 데이터 기준 KPI 계산 가능하게 작성

출력 규칙:
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일 수정 시 변경 부분만 Before/After로 출력
- 확인한 컬럼명만 간단히 보고
- 실행/확인 방법은 짧게 작성

---

대시보드 01~08, 인천대학교대학순서.png
대학 순서와 대시보드는 해당 파일들을 참고해.

---
다른 모델로 변경

현재 프로젝트 상태

완료:
- Supabase 연결 완료
- Sidebar 자동 생성 완료
- KPI 데이터 계산 완료

미완료:
- KPI 카드 UI
- 차트
- AI 분석

출력 규칙:
- 기존 파일 전체 코드 출력 금지
- 변경점만 출력

---

# 4-2단계: KPI 카드 UI 연결

목표:
4-1단계에서 만든 KPI 조회/계산 함수를 사용해 Main Dashboard 상단에 KPI 카드를 표시한다.

현재 상태:
- Sidebar 선택 기능 완료
- 선택된 대학/학과 상태 있음
- KPI 계산 함수 완료

작업:
1. DashboardContent 또는 Main Content 컴포넌트에서 선택값을 기준으로 KPI 데이터 조회
2. KPI 카드 4개 표시
3. 선택값이 바뀌면 KPI도 바뀌도록 연결
4. 로딩 상태 표시
5. 에러 상태 표시

KPI 카드:
1. 총 강좌수
2. 총 수강인원
3. 평균 수강률
4. 원어 강의 비율

표시 형식:
- 총 강좌수: 1,234개
- 총 수강인원: 12,345명
- 평균 수강률: 87.5%
- 원어 강의 비율: 12.3%

디자인:
- 카드형 UI
- 2x2 또는 4열 반응형 Grid
- 아이콘 사용 가능
- 기존 디자인 톤 유지
- 다크모드 대응

수정 가능 파일:
- components/dashboard/dashboard-content.tsx
- components/dashboard/kpi-cards.tsx 생성 가능
- 필요 시 app/page.tsx 최소 수정

주의:
- Sidebar 구조 유지
- Header/Footer/Layout 수정 금지
- 차트/AI 구현 금지
- Supabase 초기화 파일 수정 금지
- 기존 파일 전체 코드 출력 금지

출력 규칙:
- 기존 파일 수정 시 변경 부분만 Before/After로 출력
- 수정 이유 간단히 보고
- 실행/확인 방법 짧게 작성

---

# 5-1단계: 차트 데이터 계산 로직 작성

목표:
선택한 대학/학과 기준으로 차트에 사용할 통계 데이터를 계산한다.

현재 상태:
- Sidebar 완료
- KPI 데이터 계산 완료
- KPI 카드 UI 완료

이번 단계에서는 차트 UI를 만들지 않는다.
차트 데이터 계산 함수와 타입만 작성한다.

작업:
1. 선택된 대학/학과 기준으로 교과목 데이터 조회
2. 이수구분별 강좌수 계산
3. 이수구분별 평균 수강인원 계산
4. 수업방법 유형 분포 계산
5. 학점 구성 비율 계산
6. 요일별 수업 강좌 수 계산
7. 수업 시간별 강좌 수 계산
8. 차트 데이터 타입 정의
9. 차트 데이터 조회 함수 작성

필요 차트:
- 이수구분별 강좌수
- 이수구분별 평균 수강인원
- 수업방법 유형 분포
- 학점 구성 비율
- 요일별 수업 강좌 수
- 수업 시간별 강좌 수

컬럼명은 실제 Supabase 테이블 컬럼명을 확인해서 사용한다.

예상 컬럼 후보:
- 이수구분: 이수구분, 교과구분, 영역
- 수강인원: 수강인원, 신청인원, 수강생수
- 수업방법: 수업방법, 강의방식, 수업유형
- 학점: 학점, 인정학점
- 요일: 요일, 강의요일, 수업요일
- 시간: 시간, 강의시간, 수업시간, 교시

수정 가능 파일:
- types/course.ts
- lib/supabase/queries.ts
- lib/dashboard-utils.ts

주의:
- UI 파일 수정 금지
- KPI 카드 수정 금지
- Sidebar 수정 금지
- Header/Footer/Layout 수정 금지
- AI 구현 금지
- null, undefined 안전 처리
- 선택값이 null이면 전체 데이터 기준 계산 가능하게 작성

출력 규칙:
- 기존 파일 전체 코드 출력 금지
- 기존 파일 수정 시 변경 부분만 Before/After로 출력
- 확인한 컬럼명만 간단히 보고
- 실행/확인 방법은 짧게 작성

---

# 5-2단계: 차트 UI 연결

목표:
5-1에서 만든 차트 데이터 함수를 사용해 Main Dashboard에 차트 6개를 표시한다.

현재 완료:
- Sidebar 선택 기능
- KPI 카드
- 차트 데이터 계산 함수

작업:
1. 선택된 대학/학과 기준으로 차트 데이터 조회
2. Recharts로 차트 6개 표시
3. 선택값 변경 시 차트 갱신
4. 로딩/에러/빈 데이터 처리

차트:
- 이수구분별 강좌수: BarChart
- 이수구분별 평균 수강인원: BarChart
- 수업방법 유형 분포: PieChart
- 학점 구성 비율: PieChart
- 요일별 수업 강좌 수: BarChart
- 수업 시간별 강좌 수: BarChart

수정 가능:
- components/dashboard/dashboard-content.tsx
- components/dashboard/charts-section.tsx 생성 가능
- components/dashboard/chart-card.tsx 생성 가능

주의:
- Header/Footer/Layout 수정 금지
- Sidebar 수정 금지
- KPI 계산 로직 수정 금지
- AI 구현 금지
- 기존 파일 전체 코드 출력 금지
- 기존 파일은 변경 부분만 출력

확인:
npm run dev 후 대학/학과 선택 시 차트 6개가 보이면 성공.

---

# 6-1단계: 상세 강좌 테이블 데이터 준비

목표:
선택한 대학/학과 기준으로 상세 강좌 정보 테이블에 사용할 데이터 조회 로직만 만든다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 데이터
- 차트 UI

작업:
1. 선택된 대학/학과 기준으로 강좌 목록 조회
2. 상세 테이블용 타입 정의
3. 검색/정렬/페이지네이션에 대비한 조회 함수 작성
4. 필요한 컬럼만 select
5. null, undefined 안전 처리

상세 테이블 추천 컬럼:
- 교과목명
- 교과목번호 또는 학수번호
- 이수구분
- 대학
- 학과
- 담당교수
- 학점
- 수강인원
- 수강정원
- 수업방법
- 강의시간
- 강의실

수정 가능:
- types/course.ts
- lib/supabase/queries.ts
- 필요 시 lib/table-utils.ts 생성

함수 예시:
- getCourseTableData(selectedMenu)
- normalizeCourseTableRow(row)

주의:
- UI 구현 금지
- 테이블 컴포넌트 생성 금지
- Header/Footer/Layout 수정 금지
- Sidebar/KPI/차트 수정 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

출력:
1. 확인한 실제 컬럼명
2. 생성/수정 파일
3. 변경점만
4. 간단 확인 방법

---

# 6-2단계: 상세 강좌 테이블 UI 연결

목표:
6-1에서 만든 상세 강좌 조회 함수를 사용해 Main Dashboard 하단에 상세 강좌 정보 테이블을 표시한다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 데이터 조회 함수

작업:
1. 선택된 대학/학과 기준으로 상세 강좌 목록 조회
2. 테이블 UI 표시
3. 검색 기능 추가
4. 페이지네이션 추가
5. 로딩/에러/빈 데이터 처리

표시 컬럼:
- 교과목명
- 학수번호
- 이수구분
- 대학
- 학과
- 담당교수
- 학점
- 수강인원
- 수강정원
- 수업방법
- 강의시간
- 강의실

수정 가능:
- components/dashboard/dashboard-content.tsx
- components/dashboard/course-table.tsx 생성 가능
- components/ui/input.tsx 없으면 추가
- components/ui/table.tsx 없으면 추가
- components/ui/button.tsx 없으면 추가

요구:
- 선택값 변경 시 테이블 갱신
- 검색어로 교과목명/교수명/학과명 검색
- 한 페이지 10개
- 이전/다음 버튼
- 긴 텍스트 줄바꿈
- 모바일에서 가로 스크롤 허용

주의:
- Header/Footer/Layout 수정 금지
- Sidebar/KPI/차트 로직 수정 금지
- AI 구현 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

확인:
npm run dev 후 대학/학과 선택 시 상세 강좌 테이블이 보이면 성공.

---

발급받은 Gemini API 키를 .env.local 파일에 저장해줘.

GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyCgk00VGW-aE8CNE5MhHrUu67YNIzA5z4Y

---

# 7-1단계: AI 강의 분석 API 연결 준비

목표:
선택한 대학/학과의 강의 데이터를 Gemini로 분석할 수 있도록 서버 API 로직을 만든다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 테이블

이번 단계에서는 AI 분석 버튼이나 화면 UI는 만들지 않는다.
API Route와 분석 유틸만 만든다.

작업:
1. Gemini API 환경변수 확인
2. 선택된 대학/학과 기준 강좌 데이터 조회
3. AI 분석용 데이터 요약 함수 작성
4. Gemini API 호출 함수 작성
5. app/api/ai-analysis/route.ts 생성
6. 분석 결과를 markdown 문자열로 반환

환경변수:
- GEMINI_API_KEY

사용 모델:
- gemini-3.1-flash-lite
단, 해당 모델명이 오류 나면 현재 사용 가능한 Flash-Lite 모델명으로 수정

API 요청 형식:
POST /api/ai-analysis

body 예시:
{
  "selectedMenu": {
    "type": "college",
    "name": "공과대학"
  }
}

또는

{
  "selectedMenu": {
    "type": "department",
    "name": "컴퓨터공학부",
    "college": "공과대학"
  }
}

응답 형식:
{
  "markdown": "AI 분석 결과 markdown 내용"
}

분석 내용:
- 선택한 대학/학과의 전체 강좌 현황
- 이수구분 분포 요약
- 수강인원 특징
- 수업방법 특징
- 학점 분포 특징
- 요일/시간대 특징
- 운영상 강점
- 개선 제안
- 종합 결론

수정 가능:
- lib/ai-analysis.ts 생성 가능
- app/api/ai-analysis/route.ts 생성 가능
- lib/supabase/queries.ts 최소 수정 가능
- types/course.ts 최소 수정 가능

주의:
- 클라이언트 컴포넌트에서 GEMINI_API_KEY 사용 금지
- API Key는 서버에서만 사용
- UI 구현 금지
- 버튼 생성 금지
- Header/Footer/Layout 수정 금지C:\Users\user\Desktop\AI코딩\final\next.config.ts
- Sidebar/KPI/차트/테이블 UI 수정 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

에러 처리:
- GEMINI_API_KEY 없으면 명확한 에러 반환
- selectedMenu 없으면 전체 데이터 기준 분석
- 데이터 없으면 에러 반환
- Gemini 호출 실패 시 에러 반환

확인:
API Route 생성 후, 필요하면 Antigravity가 간단한 curl 또는 fetch 테스트 방법만 알려주면 된다.

---

# 7-2단계: AI 분석 UI + Markdown 다운로드

목표:
7-1에서 만든 `/api/ai-analysis`를 사용해 AI 강의 분석 기능을 화면에 연결한다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 테이블
- AI 분석 API Route

작업:
1. Main Dashboard에 “AI 강의 분석” 버튼 추가
2. 선택된 대학/학과 기준으로 `/api/ai-analysis` POST 호출
3. 분석 중 로딩 상태 표시
4. 분석 결과 Markdown 표시
5. 분석 결과를 `.md` 파일로 다운로드
6. 에러 상태 표시

UI 위치:
- KPI 카드와 차트 아래
- 상세 강좌 테이블 위 또는 아래 중 자연스러운 위치

버튼 문구:
AI 강의 분석

선택값별 동작:
- 대학 선택 시 해당 대학 분석
- 학과 선택 시 해당 학과 분석
- 선택값이 없으면 전체 강좌 분석

다운로드 파일명 예시:
- 전체_강의_분석.md
- 공과대학_강의_분석.md
- 컴퓨터공학부_강의_분석.md

수정 가능:
- components/dashboard/dashboard-content.tsx
- components/dashboard/ai-analysis-section.tsx 생성 가능
- 필요 시 lib/download-utils.ts 생성 가능

주의:
- GEMINI_API_KEY를 클라이언트에서 직접 사용 금지
- 반드시 `/api/ai-analysis`를 통해 호출
- Header/Footer/Layout 수정 금지
- Sidebar/KPI/차트/테이블 로직 수정 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

에러 처리:
- API 호출 실패 시 메시지 표시
- 분석 결과가 비어 있으면 메시지 표시
- 중복 클릭 방지
- 로딩 중 버튼 비활성화

확인:
npm run dev 실행 후
대학 또는 학과 선택 → AI 강의 분석 클릭 → 분석 결과 표시 → md 다운로드 확인

---

# 8-1단계: Breadcrumb + Footer + 필수 UI 점검

목표:
과제 필수 UI 요소를 마무리한다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 테이블
- AI 강의 분석
- Markdown 다운로드

작업:
1. Breadcrumb 추가
2. 선택된 대학/학과에 따라 Breadcrumb 갱신
3. Footer 링크 점검
4. Footer 제작자 이름 점검
5. 전체 필수 요구사항 누락 여부 점검

Breadcrumb 예시:
- 전체
- 전체 > 공과대학
- 전체 > 공과대학 > 컴퓨터공학부

Footer 필수:
- 인천대학교 홈페이지: https://www.inu.ac.kr
- INU 포털: https://portal.inu.ac.kr
- 이러닝: https://cyber.inu.ac.kr
- 제작자: 김기태

수정 가능:
- components/dashboard/dashboard-content.tsx
- components/dashboard/breadcrumb-nav.tsx 생성 가능
- components/layout/footer.tsx
- 필요 시 app/page.tsx 최소 수정

주의:
- 핵심 로직 수정 금지
- Supabase 관련 코드 수정 금지
- AI API 수정 금지
- Sidebar/KPI/차트/테이블 계산 로직 수정 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

확인:
npm run dev 후
대학/학과 선택 시 Breadcrumb이 바뀌고,
Footer 링크 3개와 제작자 이름이 정상 표시되면 성공.

---

# 8-2단계: 디자인 개선 + 추가점수 기능

목표:
기본 기능은 유지하면서 디자인 완성도를 높이고, 추가점수용 창의적 기능을 1~2개 추가한다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 테이블
- AI 강의 분석
- Markdown 다운로드
- Breadcrumb
- Footer

작업:
1. 전체 Dashboard 디자인 정리
2. 카드 간격, 여백, 제목 계층 개선
3. 차트/테이블/AI 분석 영역 시각적 구분
4. 반응형 UI 점검
5. 추가 기능 1~2개 구현

추천 추가 기능:
1. 강좌 즐겨찾기
- 상세 강좌 테이블 각 행에 즐겨찾기 버튼 추가
- localStorage에 저장
- 즐겨찾기한 강좌만 보기 토글 추가

2. 강좌명/교수명/학과명 통합 검색 개선
- 검색어 하이라이트
- 검색 결과 개수 표시

3. 대시보드 요약 카드 추가
- 가장 강좌 수가 많은 학과
- 평균 수강률이 높은 이수구분
- 가장 많은 수업방법
- 가장 많은 요일

가능하면 1번과 2번을 우선 구현한다.

수정 가능:
- components/dashboard/course-table.tsx
- components/dashboard/dashboard-content.tsx
- components/dashboard/summary-insights.tsx 생성 가능
- lib/dashboard-utils.ts 최소 수정 가능
- 필요 시 lib/favorites-utils.ts 생성 가능

주의:
- 기존 필수 기능 깨지지 않게 유지
- Supabase 데이터 수정 금지
- AI API 수정 금지
- Header/Footer/Layout 큰 구조 수정 금지
- 기존 파일 전체 코드 출력 금지
- 새 파일만 전체 코드 출력
- 기존 파일은 변경 부분만 출력

디자인 방향:
- 대시보드 섹션마다 제목과 설명 추가
- 카드 hover 효과
- 테이블 가독성 개선
- 검색/필터 영역 정돈
- 모바일 가로 스크롤 유지
- 다크모드 유지

확인:
npm run dev 후
- 기존 KPI/차트/테이블/AI 분석이 정상 작동
- 즐겨찾기 추가/해제 가능
- 즐겨찾기만 보기 가능
- 검색 결과 개수 표시
- 새로고침 후 즐겨찾기 유지

---
# 9단계: 최종 점검 + 배포 준비

목표:
과제 제출 전 필수 요구사항, 에러, 배포 설정을 최종 점검한다.

현재 완료:
- Sidebar
- KPI 카드
- 차트 6개
- 상세 강좌 테이블
- AI 강의 분석
- Markdown 다운로드
- Breadcrumb
- Footer
- 추가 기능

작업:
1. 전체 기능 동작 점검
2. TypeScript / ESLint 에러 확인
3. 빌드 에러 확인
4. Vercel 배포 준비
5. 환경변수 누락 확인
6. 제출용 README 또는 프롬프트 문서 정리

필수 점검:
- Supabase 데이터 2,313개 행 기준 작동
- 대학/학과 Sidebar 정상 표시
- 대학 순서 정렬 확인
- KPI 카드 정상 표시
- 차트 6개 정상 표시
- Tooltip 정상 표시
- 상세 강좌 테이블 정상 표시
- 검색/페이지네이션 정상 작동
- AI 강의 분석 정상 작동
- Markdown 다운로드 정상 작동
- Breadcrumb 정상 표시
- Footer 링크 3개 정상 연결
- 제작자 이름 김기태 표시
- 모바일 화면 깨짐 없음

실행 명령:
npm run lint
npm run build
npm run dev

Vercel 환경변수:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY

주의:
- 기능 추가 금지
- 큰 구조 변경 금지
- 불필요한 리팩토링 금지
- 에러 수정만 진행
- 기존 파일 전체 코드 출력 금지
- 기존 파일은 변경 부분만 출력

출력:
1. 점검 결과
2. 발견한 문제
3. 수정한 파일
4. 배포 전 해야 할 일
5. 제출 전 체크리스트

---

git remote add origin https://github.com/kimkitae0507-create/finalexam.git
git branch -M main
git push -u origin main
깃허브 연동해줘

---


