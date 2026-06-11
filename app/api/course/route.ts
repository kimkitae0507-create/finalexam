import { NextRequest, NextResponse } from 'next/server';
import { getCourseKPIData, getCourseChartData } from '@/lib/supabase/queries';
import { SelectedMenu } from '@/types/course';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'kpi' or 'chart'
    const type = searchParams.get('type') as 'college' | 'department' | null;
    const name = searchParams.get('name');
    const college = searchParams.get('college');

    let selectedItem: SelectedMenu = null;
    if (type && name) {
      if (type === 'college') {
        selectedItem = { type, name };
      } else if (type === 'department' && college) {
        selectedItem = { type, name, college };
      }
    }

    if (action === 'kpi') {
      const kpi = await getCourseKPIData(selectedItem);
      return NextResponse.json(kpi);
    } else if (action === 'chart') {
      const chart = await getCourseChartData(selectedItem);
      return NextResponse.json(chart);
    } else if (action === 'table') {
      const { getCourseTableData } = await import('@/lib/supabase/queries');
      const tableData = await getCourseTableData(selectedItem);
      return NextResponse.json(tableData);
    }


    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }

}
