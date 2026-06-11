import { NextRequest, NextResponse } from 'next/server';
import { SelectedMenu } from '@/types/course';
import { getCoursesByCollege, getCoursesByDepartment, getAllCourses } from '@/lib/supabase/queries';
import { generateAIAnalysis } from '@/lib/ai-analysis';

export async function POST(request: NextRequest) {
  try {
    // 1. API Key 사전 검증
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY가 서버에 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 2. 요청 파싱
    const body = await request.json().catch(() => ({}));
    const selectedMenu: SelectedMenu | null = body.selectedMenu ?? null;

    // 3. 강좌 데이터 조회
    let courses;
    if (!selectedMenu) {
      courses = await getAllCourses();
    } else if (selectedMenu.type === 'college') {
      courses = await getCoursesByCollege(selectedMenu.name);
    } else if (selectedMenu.type === 'department') {
      courses = await getCoursesByDepartment(selectedMenu.name);
    } else {
      return NextResponse.json({ error: 'selectedMenu.type은 college 또는 department여야 합니다.' }, { status: 400 });
    }

    if (!courses || courses.length === 0) {
      return NextResponse.json(
        { error: `선택한 조건(${selectedMenu?.name ?? '전체'})에 해당하는 강좌가 없습니다.` },
        { status: 404 }
      );
    }

    // 4. Gemini AI 분석 생성 (시간이 걸릴 수 있음)
    const markdown = await generateAIAnalysis(courses, selectedMenu);

    return NextResponse.json({ markdown });

  } catch (error: any) {
    console.error('[ai-analysis] Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET은 허용하지 않음
export async function GET() {
  return NextResponse.json({ error: 'POST 메서드만 지원합니다.' }, { status: 405 });
}
