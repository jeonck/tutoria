export interface Tutorial {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  tags: string[];
  content: string;
  isCompleted: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  // Markdown file management fields
  originalFileName?: string;
  originalMarkdownContent?: string;
  isImportedFromMarkdown?: boolean;
  // Shared markdown fields
  isSharedMarkdown?: boolean;
  uploadedBy?: string;
}

export interface TechStackCollection {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  tutorialIds: number[];
  estimatedDuration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  isCompleted: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrashItem {
  id: number;
  type: 'tutorial' | 'collection';
  originalId: number;
  data: Tutorial | TechStackCollection;
  deletedAt: string;
  deletedBy?: string; // For future user tracking
}

export interface SharedMarkdownFile {
  id: number;
  filename: string;
  originalContent: string;
  parsedTutorialId?: number;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  isActive: boolean;
  tutorialTitle?: string;
}

export interface DatabaseConfig {
  db: any;
  initialized: boolean;
}