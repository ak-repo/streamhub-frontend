import React from 'react';

export default function Header({ darkMode, setDarkMode }) {
  return (
    <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border-b`}>
      <div className="flex justify-between items-center p-8">
        <h1 className="text-4xl font-bold">StreamHub</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Dark Mode</span>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-14 h-8 rounded-full transition-colors ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
}