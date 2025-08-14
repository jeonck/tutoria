import React from 'react';
import { Download, FileText } from 'lucide-react';

interface ExampleDownloaderProps {
  onDownload: () => void;
}

export const ExampleDownloader: React.FC<ExampleDownloaderProps> = ({ onDownload }) => {
  return (
    <button
      onClick={onDownload}
      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      title="Download React Getting Started Example"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Example</span>
    </button>
  );
};