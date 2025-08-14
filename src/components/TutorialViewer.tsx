import React from 'react';
import { X, Clock, Star, CheckCircle, BookOpen, Calendar, Tag, Copy, Download, FileText } from 'lucide-react';
import { Tutorial } from '../types/tutorial';

interface TutorialViewerProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: Tutorial | null;
  onToggleComplete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onDownloadMarkdown?: (tutorial: Tutorial) => void;
}

export const TutorialViewer: React.FC<TutorialViewerProps> = ({
  isOpen,
  onClose,
  tutorial,
  onToggleComplete,
  onToggleFavorite,
  onDownloadMarkdown
}) => {
  if (!isOpen || !tutorial) return null;

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const parseMarkdown = (content: string) => {
    const lines = content.split('\n');
    const result: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks - improved handling
      if (line.trim().startsWith('```')) {
        const language = line.trim().slice(3).trim() || 'text';
        const codeLines: string[] = [];
        i++;
        
        // Collect all lines until closing ```
        while (i < lines.length) {
          if (lines[i].trim().startsWith('```')) {
            break;
          }
          codeLines.push(lines[i]);
          i++;
        }
        
        const code = codeLines.join('\n');
        
        // Only render if we have actual code content
        if (code.trim()) {
          result.push(
            <div key={`code-${i}`} className="my-6 rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono flex items-center justify-between">
                <span className="text-blue-300">{language}</span>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                  title="Copy code"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                <code className="text-sm font-mono leading-relaxed whitespace-pre">{code}</code>
              </pre>
            </div>
          );
        }
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        result.push(
          <h1 key={`h1-${i}`} className="text-3xl font-bold text-gray-900 mb-6 mt-8 pb-2 border-b-2 border-blue-200">
            {line.slice(2).trim()}
          </h1>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        result.push(
          <h2 key={`h2-${i}`} className="text-2xl font-semibold text-gray-800 mb-4 mt-6 pb-1 border-b border-gray-200">
            {line.slice(3).trim()}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('### ')) {
        result.push(
          <h3 key={`h3-${i}`} className="text-xl font-medium text-gray-700 mb-3 mt-5">
            {line.slice(4).trim()}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('#### ')) {
        result.push(
          <h4 key={`h4-${i}`} className="text-lg font-medium text-gray-700 mb-2 mt-4">
            {line.slice(5).trim()}
          </h4>
        );
        i++;
        continue;
      }

      if (line.startsWith('##### ')) {
        result.push(
          <h5 key={`h5-${i}`} className="text-base font-medium text-gray-700 mb-2 mt-3">
            {line.slice(6).trim()}
          </h5>
        );
        i++;
        continue;
      }

      // Unordered Lists
      if (line.match(/^[\-\*\+] /)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^[\-\*\+] /)) {
          listItems.push(lines[i].replace(/^[\-\*\+] /, '').trim());
          i++;
        }
        result.push(
          <ul key={`ul-${i}`} className="mb-4 space-y-1 ml-6">
            {listItems.map((item, idx) => (
              <li key={idx} className="list-disc">
                {renderInlineElements(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered Lists
      if (line.match(/^\d+\. /)) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\. /)) {
          listItems.push(lines[i].replace(/^\d+\. /, '').trim());
          i++;
        }
        result.push(
          <ol key={`ol-${i}`} className="mb-4 space-y-1 ml-6">
            {listItems.map((item, idx) => (
              <li key={idx} className="list-decimal">
                {renderInlineElements(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2).trim());
          i++;
        }
        result.push(
          <blockquote key={`quote-${i}`} className="border-l-4 border-blue-300 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
            {quoteLines.map((quoteLine, idx) => (
              <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
                {renderInlineElements(quoteLine)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Horizontal rules
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        result.push(<hr key={`hr-${i}`} className="my-8 border-t-2 border-gray-200" />);
        i++;
        continue;
      }

      // Tables - basic support
      if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableRows: string[][] = [];
        let isHeaderSeparator = false;
        
        while (i < lines.length && lines[i].includes('|')) {
          const currentLine = lines[i].trim();
          if (currentLine.startsWith('|') && currentLine.endsWith('|')) {
            // Check if this is a header separator line
            if (currentLine.match(/^\|[\s\-\|:]+\|$/)) {
              isHeaderSeparator = true;
              i++;
              continue;
            }
            
            const cells = currentLine.slice(1, -1).split('|').map(cell => cell.trim());
            tableRows.push(cells);
          } else {
            break;
          }
          i++;
        }
        
        if (tableRows.length > 0) {
          result.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-lg">
                {tableRows.length > 0 && (
                  <thead className="bg-gray-50">
                    <tr>
                      {tableRows[0].map((cell, idx) => (
                        <th key={idx} className="px-4 py-2 border-b border-gray-300 text-left font-medium text-gray-900">
                          {renderInlineElements(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {tableRows.slice(1).map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-2 border-b border-gray-200 text-gray-700">
                          {renderInlineElements(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Empty lines
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Regular paragraphs
      const paragraphLines: string[] = [];
      while (i < lines.length && 
             lines[i].trim() !== '' && 
             !lines[i].startsWith('#') && 
             !lines[i].trim().startsWith('```') &&
             !lines[i].match(/^[\-\*\+] /) && 
             !lines[i].match(/^\d+\. /) &&
             !lines[i].startsWith('> ') && 
             !lines[i].match(/^[\-\*_]{3,}$/) &&
             !(lines[i].includes('|') && lines[i].trim().startsWith('|'))) {
        paragraphLines.push(lines[i]);
        i++;
      }

      if (paragraphLines.length > 0) {
        const paragraphText = paragraphLines.join(' ').trim();
        if (paragraphText) {
          result.push(
            <p key={`p-${i}`} className="mb-4 text-gray-700 leading-relaxed">
              {renderInlineElements(paragraphText)}
            </p>
          );
        }
      }
    }

    return result;
  };

  const renderInlineElements = (text: string) => {
    if (!text) return '';
    
    // Split text by inline code first to preserve it
    const parts = text.split(/(`[^`]+`)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        // Inline code
        return (
          <code key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border">
            {part.slice(1, -1)}
          </code>
        );
      }

      // Process other inline elements
      let processed = part;
      
      // Bold - **text** or __text__
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      processed = processed.replace(/__(.*?)__/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      
      // Italic - *text* or _text_ (but not if it's part of bold)
      processed = processed.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic text-gray-700">$1</em>');
      processed = processed.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em class="italic text-gray-700">$1</em>');
      
      // Strikethrough - ~~text~~
      processed = processed.replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>');
      
      // Links - [text](url)
      processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
      
      // Auto-links - http(s)://...
      processed = processed.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

      if (processed === part) {
        return part;
      }

      return <span key={index} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex-1 mr-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {tutorial.category}
              </span>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty}
              </span>
              {tutorial.isImportedFromMarkdown && (
                <div className="flex items-center space-x-1 bg-purple-100 px-3 py-1 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Imported from Markdown</span>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tutorial.title}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {tutorial.description}
            </p>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tutorial.duration}분</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>생성: {formatDate(tutorial.createdAt)}</span>
              </div>
              {tutorial.updatedAt !== tutorial.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>수정: {formatDate(tutorial.updatedAt)}</span>
                </div>
              )}
              {tutorial.originalFileName && (
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>파일: {tutorial.originalFileName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Download Markdown button - now available for all tutorials */}
            {onDownloadMarkdown && (
              <button
                onClick={() => onDownloadMarkdown(tutorial)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors border ${
                  tutorial.isImportedFromMarkdown
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200'
                }`}
                title={
                  tutorial.isImportedFromMarkdown
                    ? 'Download original markdown file'
                    : 'Export tutorial as markdown'
                }
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {tutorial.isImportedFromMarkdown ? 'Download Original' : 'Export MD'}
                </span>
              </button>
            )}

            <button
              onClick={() => onToggleComplete(tutorial.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                tutorial.isCompleted
                  ? 'text-green-700 bg-green-100 border border-green-200'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              <CheckCircle className={`h-4 w-4 ${tutorial.isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
              <span>{tutorial.isCompleted ? '완료됨' : '완료 표시'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(tutorial.id)}
              className={`p-2 rounded-lg transition-colors ${
                tutorial.isFavorite
                  ? 'text-yellow-600 bg-yellow-100 border border-yellow-200'
                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 border border-gray-200'
              }`}
            >
              <Star className={`h-5 w-5 ${tutorial.isFavorite ? 'fill-current' : ''}`} />
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
        {tutorial.tags.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-200/50 bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag, index) => (
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

        {/* Content */}
        <div className="p-6 pb-12 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="prose prose-gray max-w-none">
            {parseMarkdown(tutorial.content)}
            {/* Extra spacing at the bottom for comfortable reading */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};