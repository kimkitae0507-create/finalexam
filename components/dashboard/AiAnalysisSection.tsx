'use client';

import React, { useState } from 'react';
import { SelectedMenu } from '@/types/course';
import { Sparkles, Download, AlertCircle, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface AiAnalysisSectionProps {
  selectedItem: SelectedMenu;
}

export default function AiAnalysisSection({ selectedItem }: AiAnalysisSectionProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedMenu: selectedItem }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'AI 분석 데이터를 가져오는데 실패했습니다.');
      }

      if (!data.markdown) {
        throw new Error('AI 분석 결과가 비어 있습니다.');
      }

      setResult(data.markdown);
      setIsOpen(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    // 1. 파일명 설정
    let fileName = '전체_강의_분석.md';
    if (selectedItem) {
      if (selectedItem.type === 'college') {
        fileName = `${selectedItem.name}_강의_분석.md`;
      } else if (selectedItem.type === 'department') {
        fileName = `${selectedItem.name}_강의_분석.md`;
      }
    }

    // 2. Blob 생성 및 다운로드
    const blob = new Blob([result], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ────────────────────────────────────────────────
  // 간단한 Markdown 렌더러 함수
  // ────────────────────────────────────────────────
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Horizontal Rule
      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        return <hr key={index} className="my-6 border-gray-200 dark:border-gray-800" />;
      }

      // Headers (H1, H2, H3, H4)
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4 flex items-center gap-2">
            {parseInlineMarkdown(trimmed.slice(2))}
          </h1>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
            {parseInlineMarkdown(trimmed.slice(3))}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-gray-800 dark:text-gray-200 mt-5 mb-2">
            {parseInlineMarkdown(trimmed.slice(4))}
          </h3>
        );
      }
      if (trimmed.startsWith('#### ')) {
        return (
          <h4 key={index} className="text-base font-bold text-gray-800 dark:text-gray-300 mt-4 mb-2">
            {parseInlineMarkdown(trimmed.slice(5))}
          </h4>
        );
      }

      // Unordered Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <ul key={index} className="list-disc pl-5 my-1.5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            <li>{parseInlineMarkdown(trimmed.slice(2))}</li>
          </ul>
        );
      }

      // Ordered Lists (e.g. 1. 2.)
      const orderedListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (orderedListMatch) {
        return (
          <ol key={index} className="list-decimal pl-5 my-1.5 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            <li>{parseInlineMarkdown(orderedListMatch[2])}</li>
          </ol>
        );
      }

      // Empty Lines
      if (trimmed === '') {
        return <div key={index} className="h-2" />;
      }

      // Standard Paragraph
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed my-2">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Bold (**text**) 및 기타 인라인 스타일 파싱
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-blue-600 dark:text-blue-400">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              AI 강의 분석
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedItem
                ? `선택된 ${selectedItem.type === 'college' ? '대학' : '학과'} (${selectedItem.name}) 데이터를 분석합니다.`
                : '전체 교과목 데이터를 분석합니다.'}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
              loading
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI 강의 분석
              </>
            )}
          </button>

          {result && (
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer"
              title="Markdown 파일로 다운로드"
            >
              <Download className="h-4 w-4" />
              다운로드
            </button>
          )}
        </div>
      </div>

      {/* Loading Block */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-950/20">
          <Loader2 className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Gemini가 강의 데이터를 분석하고 있습니다.</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">이 작업은 약 5~10초 정도 소요될 수 있습니다.</p>
        </div>
      )}

      {/* Error Block */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            <p className="font-semibold mb-1">분석 중 오류 발생</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && !loading && (
        <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-gray-950/10">
          {/* Result Header */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-900/80 transition-colors duration-150"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">분석 보고서</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </div>

          {/* Result Content */}
          {isOpen && (
            <div className="p-6 max-h-[500px] overflow-y-auto prose dark:prose-invert max-w-none">
              {renderMarkdown(result)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
