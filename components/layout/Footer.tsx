import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const links = [
    { label: '인천대학교 홈페이지', url: 'https://www.inu.ac.kr' },
    { label: 'INU 포털', url: 'https://portal.inu.ac.kr' },
    { label: '이러닝', url: 'https://cyber.inu.ac.kr' },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left side: Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>

        {/* Right side: Author info */}
        <div className="text-sm text-gray-400 dark:text-gray-500">
          제작자: <span className="font-semibold text-gray-600 dark:text-gray-400">김기태</span>
        </div>

      </div>
    </footer>
  );
}
