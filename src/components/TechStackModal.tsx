import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Search, BookOpen } from 'lucide-react';
import { TechStackCollection, Tutorial } from '../types/tutorial';

interface TechStackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>) => void;
  collection?: TechStackCollection;
  availableTutorials: Tutorial[];
}

const PRESET_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const PRESET_ICONS = ['🚀', '💻', '🎯', '⚡', '🔥', '💡', '🛠️', '📱', '🌐', '🎨'];

export const TechStackModal: React.FC<TechStackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collection,
  availableTutorials
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🚀',
    color: '#3B82F6',
    tutorialIds: [] as number[],
    difficulty: 'Beginner' as TechStackCollection['difficulty'],
    tags: [] as string[],
    isCompleted: false,
    isFavorite: false
  });
  const [tagInput, setTagInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description,
        icon: collection.icon,
        color: collection.color,
        tutorialIds: collection.tutorialIds,
        difficulty: collection.difficulty,
        tags: collection.tags,
        isCompleted: collection.isCompleted,
        isFavorite: collection.isFavorite
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '🚀',
        color: '#3B82F6',
        tutorialIds: [],
        difficulty: 'Beginner',
        tags: [],
        isCompleted: false,
        isFavorite: false
      });
    }
  }, [collection]);

  const filteredTutorials = availableTutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedTutorials = availableTutorials.filter(tutorial =>
    formData.tutorialIds.includes(tutorial.id)
  );

  const estimatedDuration = selectedTutorials.reduce((total, tutorial) => total + tutorial.duration, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      estimatedDuration
    });
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleTutorial = (tutorialId: number) => {
    setFormData(prev => ({
      ...prev,
      tutorialIds: prev.tutorialIds.includes(tutorialId)
        ? prev.tutorialIds.filter(id => id !== tutorialId)
        : [...prev.tutorialIds, tutorialId]
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-900">
            {collection ? 'Edit Tech Stack Collection' : 'Create Tech Stack Collection'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., Full-Stack React Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as TechStackCollection['difficulty'] }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              rows={3}
              placeholder="Describe what this tech stack collection covers"
            />
          </div>

          {/* Icon and Color Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-3 text-xl rounded-lg border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? 'border-gray-400 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Tutorial Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tutorials ({formData.tutorialIds.length} selected)
            </label>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Search tutorials..."
              />
            </div>

            {/* Selected Tutorials */}
            {selectedTutorials.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Tutorials:</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedTutorials.map((tutorial) => (
                    <div
                      key={tutorial.id}
                      className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">{tutorial.title}</span>
                        <span className="text-xs text-blue-600">({tutorial.duration}min)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTutorial(tutorial.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total estimated duration: {Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m
                </div>
              </div>
            )}

            {/* Available Tutorials */}
            <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
              {filteredTutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                    formData.tutorialIds.includes(tutorial.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleTutorial(tutorial.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{tutorial.title}</h4>
                      <p className="text-xs text-gray-600">{tutorial.category} • {tutorial.difficulty} • {tutorial.duration}min</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.tutorialIds.includes(tutorial.id)}
                      onChange={() => toggleTutorial(tutorial.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isCompleted}
                onChange={(e) => setFormData(prev => ({ ...prev, isCompleted: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mark as completed</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Add to favorites</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{collection ? 'Update' : 'Create'} Collection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};