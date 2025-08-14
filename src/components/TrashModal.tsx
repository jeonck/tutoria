import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trash2, AlertTriangle, Clock, BookOpen, Layers } from 'lucide-react';
import { TrashItem } from '../types/tutorial';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  trashItems: TrashItem[];
  onRestore: (trashId: number) => void;
  onPermanentDelete: (trashId: number) => void;
  onEmptyTrash: () => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  trashItems,
  onRestore,
  onPermanentDelete,
  onEmptyTrash
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [showConfirmEmpty, setShowConfirmEmpty] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItems(new Set());
      setShowConfirmEmpty(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getItemIcon = (type: string) => {
    return type === 'tutorial' ? BookOpen : Layers;
  };

  const getItemTitle = (item: TrashItem) => {
    return item.data.title || (item.data as any).name || 'Untitled';
  };

  const handleSelectAll = () => {
    if (selectedItems.size === trashItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(trashItems.map(item => item.id)));
    }
  };

  const handleItemSelect = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleBulkRestore = () => {
    selectedItems.forEach(itemId => {
      onRestore(itemId);
    });
    setSelectedItems(new Set());
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${selectedItems.size} items? This action cannot be undone.`)) {
      selectedItems.forEach(itemId => {
        onPermanentDelete(itemId);
      });
      setSelectedItems(new Set());
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete ALL items in trash? This action cannot be undone.')) {
      onEmptyTrash();
      setShowConfirmEmpty(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trash</h2>
              <p className="text-sm text-gray-600">
                {trashItems.length} item{trashItems.length !== 1 ? 's' : ''} in trash
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {trashItems.length > 0 && (
              <>
                {selectedItems.size > 0 && (
                  <>
                    <button
                      onClick={handleBulkRestore}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restore ({selectedItems.size})</span>
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete ({selectedItems.size})</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowConfirmEmpty(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Empty Trash</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {trashItems.length === 0 ? (
            <div className="text-center py-16">
              <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Trash is empty</h3>
              <p className="text-gray-400">
                Deleted items will appear here and can be restored within 30 days
              </p>
            </div>
          ) : (
            <>
              {/* Bulk actions */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === trashItems.length && trashItems.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select all ({trashItems.length} items)
                  </span>
                </label>
                
                {selectedItems.size > 0 && (
                  <div className="text-sm text-gray-600">
                    {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>

              {/* Trash items list */}
              <div className="space-y-4">
                {trashItems.map((item) => {
                  const ItemIcon = getItemIcon(item.type);
                  const title = getItemTitle(item);
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-xl p-4 transition-all ${
                        isSelected 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleItemSelect(item.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                          />
                          
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              item.type === 'tutorial' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-purple-100 text-purple-600'
                            }`}>
                              <ItemIcon className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-lg font-medium text-gray-900 truncate">
                                  {title}
                                </h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.type === 'tutorial'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {item.type === 'tutorial' ? 'Tutorial' : 'Tech Stack'}
                                </span>
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                {item.data.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Deleted: {formatDate(item.deletedAt)}</span>
                                </div>
                                {item.type === 'tutorial' && (
                                  <span>Category: {item.data.category}</span>
                                )}
                                {item.type === 'collection' && (
                                  <span>Tutorials: {(item.data as any).tutorialIds?.length || 0}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => onRestore(item.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Restore item"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
                                onPermanentDelete(item.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Empty trash confirmation */}
        {showConfirmEmpty && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">Empty Trash</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete all {trashItems.length} items in trash? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmEmpty(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmptyTrash}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  Empty Trash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};