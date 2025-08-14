import React, { useState, useEffect } from 'react';
import { X, Download, Eye, Calendar, User, FileText, Search, Filter } from 'lucide-react';
import { SharedMarkdownFile } from '../types/tutorial';

interface SharedMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedFiles: SharedMarkdownFile[];
  onDownload: (fileId: number) => void;
  onImport: (content: string, filename: string) => void;
}

export const SharedMarkdownModal: React.FC<SharedMarkdownModalProps> = ({
  isOpen,
  onClose,
  sharedFiles,
  onDownload,
  onImport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular' | 'name'>('newest');
  const [previewFile, setPreviewFile] = useState<SharedMarkdownFile | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSortBy('newest');
      setPreviewFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredAndSortedFiles = sharedFiles
    .filter(file => 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (file.tutorialTitle && file.tutorialTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        case 'name':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (file: SharedMarkdownFile) => {
    onDownload(file.id);
    
    // Create and trigger download
    const blob = new Blob([file.originalContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: SharedMarkdownFile) => {
    onImport(file.originalContent, file.filename);
    onClose();
  };

  const getFilePreview = (content: string) => {
    const lines = content.split('\n');
    const previewLines = lines.slice(0, 20);
    return previewLines.join('\n');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-green-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-600 rounded-2xl">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shared Markdown Library</h2>
              <p className="text-gray-600">Browse and import community-shared tutorials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-6 border-b border-gray-200/50 bg-gray-50/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search files by name, title, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Downloaded</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredAndSortedFiles.length} of {sharedFiles.length} files
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {previewFile ? (
            // File Preview Mode
            <div className="h-full flex flex-col">
              {/* Preview Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ←
                  </button>
                  <div>
                    <h3 className="font-semibold text-gray-900">{previewFile.filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{previewFile.uploadedBy}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(previewFile.uploadedAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{previewFile.downloadCount} downloads</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleImport(previewFile)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Import as Tutorial
                  </button>
                  <button
                    onClick={() => handleDownload(previewFile)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download File
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="bg-white rounded-lg border p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                    {getFilePreview(previewFile.originalContent)}
                    {previewFile.originalContent.split('\n').length > 20 && (
                      <div className="mt-4 text-gray-500 italic">
                        ... (content continues - {previewFile.originalContent.length.toLocaleString()} characters total)
                      </div>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            // File List Mode
            <div className="p-6 overflow-y-auto">
              {filteredAndSortedFiles.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    {sharedFiles.length === 0 ? 'No shared files yet' : 'No files match your search'}
                  </h3>
                  <p className="text-gray-400">
                    {sharedFiles.length === 0 
                      ? 'Upload markdown files to share them with the community'
                      : 'Try adjusting your search terms or filters'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    >
                      {/* File Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FileText className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 truncate" title={file.filename}>
                              {file.filename}
                            </h4>
                            {file.tutorialTitle && (
                              <p className="text-sm text-gray-600 truncate" title={file.tutorialTitle}>
                                {file.tutorialTitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="space-y-2 mb-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{file.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(file.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>{file.downloadCount} downloads</span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 font-mono max-h-20 overflow-hidden">
                          {getFilePreview(file.originalContent).substring(0, 150)}
                          {file.originalContent.length > 150 && '...'}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleImport(file)}
                          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <span>Import</span>
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="px-3 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};