import React from 'react';
import { Search, Filter, Plus, Star, CheckCircle } from 'lucide-react';
import { MarkdownUploader } from './MarkdownUploader';
import { ExampleDownloader } from './ExampleDownloader';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
  categories: string[];
  onCreateNew: () => void;
  onMarkdownUpload: (content: string, filename: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  showFavorites,
  onToggleFavorites,
  showCompleted,
  onToggleCompleted,
  categories,
  onCreateNew,
  onMarkdownUpload
}) => {
  const downloadExample = async () => {
    try {
      const response = await fetch('/examples/react-getting-started.md');
      const content = await response.text();
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'react-getting-started.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading example:', error);
      alert('예시 파일을 다운로드할 수 없습니다.');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tutorials..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[140px]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[120px]"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            onClick={onToggleFavorites}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showFavorites
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 border border-gray-200'
            }`}
          >
            <Star className={`h-4 w-4 ${showFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Favorites</span>
          </button>

          <button
            onClick={onToggleCompleted}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showCompleted
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Completed</span>
          </button>
        </div>

        {/* Right side actions */}
        <div className="flex flex-wrap items-center gap-3">
          <ExampleDownloader onDownload={downloadExample} />
          <MarkdownUploader onUpload={onMarkdownUpload} />
          <button
            onClick={onCreateNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Tutorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};