import React from 'react';
import { X, Clock, Star, CheckCircle, BookOpen, Calendar, Tag, Users, Play } from 'lucide-react';
import { TechStackCollection, Tutorial } from '../types/tutorial';

interface TechStackViewerProps {
  isOpen: boolean;
  onClose: () => void;
  collection: TechStackCollection | null;
  tutorials: Tutorial[];
  onToggleComplete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onViewTutorial: (tutorial: Tutorial) => void;
  onToggleTutorialComplete: (id: number) => void;
}

export const TechStackViewer: React.FC<TechStackViewerProps> = ({
  isOpen,
  onClose,
  collection,
  tutorials,
  onToggleComplete,
  onToggleFavorite,
  onViewTutorial,
  onToggleTutorialComplete
}) => {
  if (!isOpen || !collection) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-50 border-green-200';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Advanced': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const completedTutorials = tutorials.filter(t => t.isCompleted);
  const progressPercentage = tutorials.length > 0 ? (completedTutorials.length / tutorials.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-4 mb-3">
              <div 
                className="p-3 rounded-xl text-white text-2xl font-bold"
                style={{ backgroundColor: collection.color }}
              >
                {collection.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {collection.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{tutorials.length} tutorials</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(collection.estimatedDuration / 60)}h {collection.estimatedDuration % 60}m</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(collection.difficulty)}`}>
                    {collection.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              {collection.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Learning Progress</span>
                <span>{completedTutorials.length}/{tutorials.length} completed ({Math.round(progressPercentage)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(collection.createdAt)}</span>
              </div>
              {collection.updatedAt !== collection.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {formatDate(collection.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleComplete(collection.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                collection.isCompleted
                  ? 'text-green-700 bg-green-100 border border-green-200'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              <CheckCircle className={`h-4 w-4 ${collection.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{collection.isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(collection.id)}
              className={`p-2 rounded-lg transition-colors ${
                collection.isFavorite
                  ? 'text-yellow-600 bg-yellow-100 border border-yellow-200'
                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-200'
              }`}
            >
              <Star className={`h-5 w-5 ${collection.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {collection.tags.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-200/50 bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {collection.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-white text-gray-700 rounded-md border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tutorial List */}
        <div className="p-6 pb-12 overflow-y-auto max-h-[calc(90vh-300px)]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Learning Path ({tutorials.length} tutorials)</span>
          </h3>

          {tutorials.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tutorials in this collection yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tutorials.map((tutorial, index) => (
                <div
                  key={tutorial.id}
                  className={`group border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                    tutorial.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Step Number */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        tutorial.isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tutorial.isCompleted ? '✓' : index + 1}
                      </div>

                      {/* Tutorial Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tutorial.title}
                          </h4>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {tutorial.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(tutorial.difficulty)}`}>
                            {tutorial.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {tutorial.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{tutorial.duration} min</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tutorial.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs text-gray-400">
                                #{tag}
                              </span>
                            ))}
                            {tutorial.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{tutorial.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewTutorial(tutorial)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View tutorial"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onToggleTutorialComplete(tutorial.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          tutorial.isCompleted
                            ? 'text-green-600 bg-green-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={tutorial.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};