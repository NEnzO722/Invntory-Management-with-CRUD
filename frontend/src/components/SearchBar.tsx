import React from 'react';
import { Category } from '../types';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  viewMode,
  setViewMode,
}) => {
  const categories: Category[] = ['all', 'Electronics', 'Furniture', 'Clothing', 'Food', 'Other'];

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12 animate-fade-in group">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-secondary-theme transition-colors group-focus-within:text-ethereal">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          className="input-field pl-14 h-16 text-lg"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-4 h-16">
        <div className="relative flex-1 md:flex-none md:w-56">
          <select
            className="input-field h-16 appearance-none cursor-pointer pr-12 font-bold"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-moonlight-900 text-primary-theme">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-secondary-theme">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex bg-mocha-50/50 dark:bg-white/5 rounded-2xl border border-mocha-200/20 dark:border-white/10 p-1.5 glass">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center justify-center w-12 rounded-xl transition-all duration-500 ${
              viewMode === 'grid'
                ? 'bg-ethereal text-moonlight-900 shadow-lg scale-105'
                : 'text-secondary-theme hover:text-primary-theme hover:bg-mocha-100/50 dark:hover:bg-white/5'
            }`}
            title="Grid View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center justify-center w-12 rounded-xl transition-all duration-500 ${
              viewMode === 'list'
                ? 'bg-ethereal text-moonlight-900 shadow-lg scale-105'
                : 'text-mocha-400 dark:text-gray-500 hover:text-mocha-900 dark:hover:text-white hover:bg-mocha-100/50 dark:hover:bg-white/5'
            }`}
            title="List View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
