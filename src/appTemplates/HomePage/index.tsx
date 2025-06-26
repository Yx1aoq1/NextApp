'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export const HomePage = () => {
  const [theme, setTheme] = useState('light');
  const isDarkPreferred =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initialize theme based on system preference
  useEffect(() => {
    setTheme(isDarkPreferred ? 'dark' : 'light');
  }, [isDarkPreferred]);

  // Toggle theme manually
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-md ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>选择Demo:</p>
      </div>

      <nav className="w-full max-w-md">
        <ul className="space-y-4">
          <li>
            <Link href="/video">
              <div
                className={`p-4 rounded-lg shadow-md text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                视频测试
              </div>
            </Link>
            <Link href="/player">
              <div
                className={`p-4 rounded-lg shadow-md text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                播放测试
              </div>
            </Link>
          </li>
          {/* 更多链接可以根据需要添加 */}
        </ul>
      </nav>
    </div>
  );
};
