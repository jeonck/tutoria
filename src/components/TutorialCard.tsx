import React from 'react';
import { Clock, Star, CheckCircle, Edit3, Trash2, BookOpen, Eye, Download, FileText, Share2 } from 'lucide-react';
import { Tutorial } from '../types/tutorial';

interface TutorialCardProps {
  tutorial: Tutorial;
  onEdit: (tutorial: Tutorial) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onView: (tutorial: Tutorial) => void;
  onDownloadMarkdown?: (tutorial: Tutorial) => void;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({
  tutorial,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleFavorite,
  onView,
  onDownloadMarkdown
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header with category and all action buttons */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-600 truncate">{tutorial.category}</span>
          {tutorial.isImportedFromMarkdown && (
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Markdown
              </span>
            </div>
          )}
          {tutorial.isSharedMarkdown && (
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Shared
              </span>
            </div>
          )}
        </div>
        
        {/* Action buttons - always visible on top right */}
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          {/* Mark Complete Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(tutorial.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              tutorial.isCompleted
                ? 'text-green-600 bg-green-50 border border-green-200'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200'
            }`}
            title={tutorial.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircle className={`h-4 w-4 ${tutorial.isCompleted ? 'text-green-600' : ''}`} />
          </button>

          {/* Favorite Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tutorial.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              tutorial.isFavorite
                ? 'text-yellow-600 bg-yellow-50 border border-yellow-200'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border border-transparent hover:border-yellow-200'
            }`}
            title={tutorial.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-4 w-4 ${tutorial.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Management buttons - show on hover */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Download Markdown button - now available for all tutorials */}
            {onDownloadMarkdown && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadMarkdown(tutorial);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  tutorial.isImportedFromMarkdown
                    ? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={
                  tutorial.isImportedFromMarkdown
                    ? 'Download original markdown'
                    : 'Export as markdown'
                }
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onView(tutorial)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View tutorial"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(tutorial)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit tutorial"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(tutorial.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete tutorial"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - clickable */}
      <div 
        className="cursor-pointer flex-1 flex flex-col"
        onClick={() => onView(tutorial)}
      >
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {tutorial.title}
        </h3>
        
        {/* Description - takes up available space */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {tutorial.description}
        </p>

        {/* Difficulty and Duration */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{tutorial.duration} min</span>
          </div>
        </div>

        {/* Author info for shared tutorials */}
        {tutorial.isSharedMarkdown && tutorial.uploadedBy && (
          <div className="mb-4 text-xs text-gray-500 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <span className="flex items-center space-x-1">
              <Share2 className="h-3 w-3" />
              <span>Shared by: {tutorial.uploadedBy}</span>
            </span>
          </div>
        )}

        {/* Tags - fixed height to prevent layout shift */}
        <div className="h-12 flex flex-wrap gap-1 content-start">
          {tutorial.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md h-fit"
            >
              #{tag}
            </span>
          ))}
          {tutorial.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400 h-fit">
              +{tutorial.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};