import React from 'react';
import { Clock, Star, CheckCircle, Edit3, Trash2, Eye, Users, BookOpen } from 'lucide-react';
import { TechStackCollection } from '../types/tutorial';

interface TechStackCardProps {
  collection: TechStackCollection;
  tutorialCount: number;
  completedCount: number;
  onEdit: (collection: TechStackCollection) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onView: (collection: TechStackCollection) => void;
}

export const TechStackCard: React.FC<TechStackCardProps> = ({
  collection,
  tutorialCount,
  completedCount,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleFavorite,
  onView
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const progressPercentage = tutorialCount > 0 ? (completedCount / tutorialCount) * 100 : 0;

  return (
    <div className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Header with icon and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div 
            className={`p-3 rounded-xl text-white text-xl font-bold flex-shrink-0`}
            style={{ backgroundColor: collection.color }}
          >
            {collection.icon}
          </div>
          <div className="min-w-0 flex-1">
            {/* Collection name with proper line height and no truncation */}
            <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 break-words">
              {collection.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{tutorialCount} tutorials</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          {/* Mark Complete Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(collection.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              collection.isCompleted
                ? 'text-green-600 bg-green-50 border border-green-200'
                : 'text-gray-400 hover:text-green-600 hover:bg-green-50 border border-transparent hover:border-green-200'
            }`}
            title={collection.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircle className={`h-4 w-4 ${collection.isCompleted ? 'text-green-600' : ''}`} />
          </button>

          {/* Favorite Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(collection.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              collection.isFavorite
                ? 'text-yellow-600 bg-yellow-50 border border-yellow-200'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border border-transparent hover:border-yellow-200'
            }`}
            title={collection.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`h-4 w-4 ${collection.isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Management buttons - show on hover */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onView(collection)}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View collection"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(collection)}
              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit collection"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(collection.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete collection"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - clickable */}
      <div 
        className="cursor-pointer flex-1 flex flex-col"
        onClick={() => onView(collection)}
      >
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {collection.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completedCount}/{tutorialCount} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Difficulty and Duration */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(collection.difficulty)}`}>
            {collection.difficulty}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{Math.round(collection.estimatedDuration / 60)}h {collection.estimatedDuration % 60}m</span>
          </div>
        </div>

        {/* Tags - fixed height to prevent layout shift */}
        <div className="h-12 flex flex-wrap gap-1 content-start">
          {collection.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md h-fit"
            >
              #{tag}
            </span>
          ))}
          {collection.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-400 h-fit">
              +{collection.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};