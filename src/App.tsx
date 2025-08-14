import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BookOpen, Database, Layers, Search, Trash2, Brain, Share2 } from 'lucide-react';
import { useDatabase } from './hooks/useDatabase';
import { TutorialCard } from './components/TutorialCard';
import { TutorialModal } from './components/TutorialModal';
import { TutorialViewer } from './components/TutorialViewer';
import { TechStackCard } from './components/TechStackCard';
import { TechStackModal } from './components/TechStackModal';
import { TechStackViewer } from './components/TechStackViewer';
import { TrashModal } from './components/TrashModal';
import { AITutorialModal } from './components/AITutorialModal';
import { SharedMarkdownModal } from './components/SharedMarkdownModal';
import { StatsCard } from './components/StatsCard';
import { PaginationControls } from './components/PaginationControls';
import { VirtualizedTutorialGrid } from './components/VirtualizedTutorialGrid';
import { parseMarkdownToTutorial, generateMarkdownFromTutorial, downloadMarkdownFile } from './utils/markdownParser';
import { Tutorial, TechStackCollection } from './types/tutorial';

const ITEMS_PER_PAGE = 18;
const VIRTUALIZATION_THRESHOLD = 50;

function App() {
  const { 
    initialized, 
    getTutorials, 
    getAllTutorials,
    getCategories,
    getStats,
    addTutorial, 
    updateTutorial, 
    deleteTutorial,
    getTechStackCollections,
    addTechStackCollection,
    updateTechStackCollection,
    deleteTechStackCollection,
    getCollectionStats,
    getTrashItems,
    restoreFromTrash,
    permanentlyDelete,
    emptyTrash,
    getSharedMarkdownFiles,
    downloadSharedMarkdownFile,
    forceRefresh
  } = useDatabase();

  // View state
  const [currentView, setCurrentView] = useState<'tutorials' | 'collections'>('tutorials');

  // Tutorial states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | undefined>();
  const [viewingTutorial, setViewingTutorial] = useState<Tutorial | null>(null);

  // AI Tutorial Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Shared Markdown Modal state
  const [isSharedModalOpen, setIsSharedModalOpen] = useState(false);

  // Tech Stack Collection states
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isCollectionViewerOpen, setIsCollectionViewerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<TechStackCollection | undefined>();
  const [viewingCollection, setViewingCollection] = useState<TechStackCollection | null>(null);

  // Trash state
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get stats and categories - these will automatically refresh when data changes
  const stats = useMemo(() => {
    try {
      return getStats();
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    }
  }, [getStats, initialized]);

  const collectionStats = useMemo(() => {
    try {
      return getCollectionStats();
    } catch (error) {
      console.error('Error getting collection stats:', error);
      return { total: 0, completed: 0, favorites: 0, totalDuration: 0 };
    }
  }, [getCollectionStats, initialized]);

  const categories = useMemo(() => {
    try {
      return getCategories();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }, [getCategories, initialized]);

  // Get all tutorials for collection management
  const allTutorials = useMemo(() => {
    try {
      return getAllTutorials();
    } catch (error) {
      console.error('Error getting all tutorials:', error);
      return [];
    }
  }, [getAllTutorials, initialized]);

  // Get tech stack collections
  const techStackCollections = useMemo(() => {
    try {
      return getTechStackCollections();
    } catch (error) {
      console.error('Error getting tech stack collections:', error);
      return [];
    }
  }, [getTechStackCollections, initialized]);

  // Get trash items
  const trashItems = useMemo(() => {
    try {
      return getTrashItems();
    } catch (error) {
      console.error('Error getting trash items:', error);
      return [];
    }
  }, [getTrashItems, initialized]);

  // Get shared markdown files
  const sharedMarkdownFiles = useMemo(() => {
    try {
      return getSharedMarkdownFiles();
    } catch (error) {
      console.error('Error getting shared markdown files:', error);
      return [];
    }
  }, [getSharedMarkdownFiles, initialized]);

  // Prepare filters for database query
  const filters = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    category: selectedCategory || undefined,
    difficulty: selectedDifficulty || undefined,
    showFavorites: showFavorites || undefined,
    showCompleted: showCompleted || undefined,
  }), [searchTerm, selectedCategory, selectedDifficulty, showFavorites, showCompleted]);

  // Get paginated tutorials
  const { tutorials, total, hasMore } = useMemo(() => {
    if (currentView !== 'tutorials') return { tutorials: [], total: 0, hasMore: false };
    try {
      return getTutorials(currentPage, ITEMS_PER_PAGE, filters);
    } catch (error) {
      console.error('Error getting tutorials:', error);
      return { tutorials: [], total: 0, hasMore: false };
    }
  }, [getTutorials, currentPage, filters, initialized, currentView]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Determine whether to use virtualization
  const useVirtualization = total > VIRTUALIZATION_THRESHOLD;

  // For virtualization, get all filtered tutorials
  const allFilteredTutorials = useMemo(() => {
    if (!useVirtualization || currentView !== 'tutorials') return [];
    try {
      return getAllTutorials().filter(tutorial => {
        const matchesSearch = !filters.searchTerm || 
          tutorial.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          tutorial.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          tutorial.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()));
        
        const matchesCategory = !filters.category || tutorial.category === filters.category;
        const matchesDifficulty = !filters.difficulty || tutorial.difficulty === filters.difficulty;
        const matchesFavorites = !filters.showFavorites || tutorial.isFavorite;
        const matchesCompleted = !filters.showCompleted || tutorial.isCompleted;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesFavorites && matchesCompleted;
      });
    } catch (error) {
      console.error('Error getting filtered tutorials:', error);
      return [];
    }
  }, [useVirtualization, filters, getAllTutorials, initialized, currentView]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty, showFavorites, showCompleted, currentView]);

  // Tutorial handlers
  const handleCreateNew = useCallback(() => {
    setEditingTutorial(undefined);
    setIsModalOpen(true);
  }, []);

  const handleCreateWithAI = useCallback(() => {
    setIsAIModalOpen(true);
  }, []);

  const handleEdit = useCallback((tutorial: Tutorial) => {
    setEditingTutorial(tutorial);
    setIsModalOpen(true);
  }, []);

  const handleView = useCallback((tutorial: Tutorial) => {
    setViewingTutorial(tutorial);
    setIsViewerOpen(true);
  }, []);

  const handleSave = useCallback((tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTutorial) {
      updateTutorial(editingTutorial.id, tutorialData);
    } else {
      addTutorial(tutorialData);
    }
    // No need to call forceRefresh - it's handled automatically in the database hooks
  }, [editingTutorial, updateTutorial, addTutorial]);

  const handleAISave = useCallback((tutorialData: Omit<Tutorial, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTutorial(tutorialData);
  }, [addTutorial]);

  const handleDelete = useCallback((id: number) => {
    if (window.confirm('Are you sure you want to delete this tutorial? It will be moved to trash and can be restored later.')) {
      deleteTutorial(id);
      // If we're on the last page and it becomes empty, go to previous page
      if (tutorials.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  }, [deleteTutorial, tutorials.length, currentPage]);

  const handleToggleComplete = useCallback((id: number) => {
    const tutorial = tutorials.find(t => t.id === id) || allFilteredTutorials.find(t => t.id === id) || allTutorials.find(t => t.id === id);
    if (tutorial) {
      updateTutorial(id, { isCompleted: !tutorial.isCompleted });
      
      // Update viewing tutorial if it's the same one
      if (viewingTutorial && viewingTutorial.id === id) {
        setViewingTutorial({ ...viewingTutorial, isCompleted: !tutorial.isCompleted });
      }
    }
  }, [tutorials, allFilteredTutorials, allTutorials, updateTutorial, viewingTutorial]);

  const handleToggleFavorite = useCallback((id: number) => {
    const tutorial = tutorials.find(t => t.id === id) || allFilteredTutorials.find(t => t.id === id) || allTutorials.find(t => t.id === id);
    if (tutorial) {
      updateTutorial(id, { isFavorite: !tutorial.isFavorite });
      
      // Update viewing tutorial if it's the same one
      if (viewingTutorial && viewingTutorial.id === id) {
        setViewingTutorial({ ...viewingTutorial, isFavorite: !tutorial.isFavorite });
      }
    }
  }, [tutorials, allFilteredTutorials, allTutorials, updateTutorial, viewingTutorial]);

  // Markdown download handler
  const handleDownloadMarkdown = useCallback((tutorial: Tutorial) => {
    try {
      const markdownContent = generateMarkdownFromTutorial(tutorial);
      const filename = tutorial.originalFileName || `${tutorial.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.md`;
      downloadMarkdownFile(markdownContent, filename);
      
      // Show success message
      console.log(`📥 Downloaded markdown file: ${filename}`);
    } catch (error) {
      console.error('Error downloading markdown:', error);
      alert('Error downloading markdown file. Please try again.');
    }
  }, []);

  // Tech Stack Collection handlers
  const handleCreateNewCollection = useCallback(() => {
    setEditingCollection(undefined);
    setIsCollectionModalOpen(true);
  }, []);

  const handleEditCollection = useCallback((collection: TechStackCollection) => {
    setEditingCollection(collection);
    setIsCollectionModalOpen(true);
  }, []);

  const handleViewCollection = useCallback((collection: TechStackCollection) => {
    setViewingCollection(collection);
    setIsCollectionViewerOpen(true);
  }, []);

  const handleSaveCollection = useCallback((collectionData: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingCollection) {
      updateTechStackCollection(editingCollection.id, collectionData);
    } else {
      addTechStackCollection(collectionData);
    }
  }, [editingCollection, updateTechStackCollection, addTechStackCollection]);

  const handleDeleteCollection = useCallback((id: number) => {
    if (window.confirm('Are you sure you want to delete this tech stack collection? It will be moved to trash and can be restored later.')) {
      deleteTechStackCollection(id);
    }
  }, [deleteTechStackCollection]);

  const handleToggleCollectionComplete = useCallback((id: number) => {
    const collection = techStackCollections.find(c => c.id === id);
    if (collection) {
      updateTechStackCollection(id, { isCompleted: !collection.isCompleted });
      
      // Update viewing collection if it's the same one
      if (viewingCollection && viewingCollection.id === id) {
        setViewingCollection({ ...viewingCollection, isCompleted: !collection.isCompleted });
      }
    }
  }, [techStackCollections, updateTechStackCollection, viewingCollection]);

  const handleToggleCollectionFavorite = useCallback((id: number) => {
    const collection = techStackCollections.find(c => c.id === id);
    if (collection) {
      updateTechStackCollection(id, { isFavorite: !collection.isFavorite });
      
      // Update viewing collection if it's the same one
      if (viewingCollection && viewingCollection.id === id) {
        setViewingCollection({ ...viewingCollection, isFavorite: !collection.isFavorite });
      }
    }
  }, [techStackCollections, updateTechStackCollection, viewingCollection]);

  // Trash handlers
  const handleRestoreFromTrash = useCallback((trashId: number) => {
    const success = restoreFromTrash(trashId);
    if (success) {
      // Show success message or toast
      console.log('Item restored successfully');
    }
  }, [restoreFromTrash]);

  const handlePermanentDelete = useCallback((trashId: number) => {
    const success = permanentlyDelete(trashId);
    if (success) {
      console.log('Item permanently deleted');
    }
  }, [permanentlyDelete]);

  const handleEmptyTrash = useCallback(() => {
    const success = emptyTrash();
    if (success) {
      console.log('Trash emptied');
      setIsTrashModalOpen(false);
    }
  }, [emptyTrash]);

  // Shared markdown handlers
  const handleSharedMarkdownDownload = useCallback((fileId: number) => {
    const fileData = downloadSharedMarkdownFile(fileId);
    if (fileData) {
      console.log(`📥 Downloaded shared file: ${fileData.filename}`);
    }
  }, [downloadSharedMarkdownFile]);

  const handleSharedMarkdownImport = useCallback((content: string, filename: string) => {
    try {
      const parsedTutorial = parseMarkdownToTutorial(content, filename);
      addTutorial({
        ...parsedTutorial,
        isCompleted: false,
        isFavorite: false,
        isSharedMarkdown: false // Mark as imported from shared library, not as shared itself
      });
      
      // Show success message
      const successMessage = `Successfully imported "${parsedTutorial.title}" from shared library`;
      alert(successMessage);
    } catch (error) {
      console.error('Error importing shared markdown:', error);
      alert('Error importing markdown file. Please check the file format.');
    }
  }, [addTutorial]);

  const handleMarkdownUpload = useCallback((content: string, filename: string) => {
    try {
      const parsedTutorial = parseMarkdownToTutorial(content, filename);
      
      // Ask user if they want to share this file with the community
      const shouldShare = window.confirm(
        `Do you want to share "${parsedTutorial.title}" with the community?\n\n` +
        'Shared files will be available for other users to download and import.\n\n' +
        'Click OK to share, or Cancel to keep it private.'
      );
      
      addTutorial({
        ...parsedTutorial,
        isCompleted: false,
        isFavorite: false,
        isSharedMarkdown: shouldShare,
        uploadedBy: shouldShare ? 'Anonymous User' : undefined
      });
      
      // Show success message
      const successMessage = shouldShare 
        ? `Successfully imported and shared "${parsedTutorial.title}" with the community!`
        : `Successfully imported "${parsedTutorial.title}" from ${filename}`;
      alert(successMessage);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      alert('Error parsing markdown file. Please check the file format.');
    }
  }, [addTutorial]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-blue-600">
          <div className="relative">
            <Database className="h-12 w-12 animate-pulse" />
            <div className="absolute inset-0 h-12 w-12 animate-spin">
              <div className="h-3 w-3 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xl font-medium block">Loading Tutorial Manager</span>
            <span className="text-sm text-blue-500 mt-1">Initializing database...</span>
          </div>
        </div>
      </div>
    );
  }

  const displayTutorials = useVirtualization ? allFilteredTutorials : tutorials;
  const currentStats = currentView === 'tutorials' ? stats : collectionStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tutorial Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Organize, track, and manage your learning journey with our beautiful tutorial management system
          </p>
        </div>

        {/* Stats */}
        <StatsCard 
          tutorials={{
            total: currentStats.total,
            completed: currentStats.completed,
            favorites: currentStats.favorites,
            totalDuration: currentStats.totalDuration
          }} 
        />

        {/* Improved Filter and Action Layout */}
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 mb-8">
          {/* Main Layout: Left Section (View + Filters) and Right Section (Actions) */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
            
            {/* Left Section: View Toggle + Search + Filters */}
            <div className="flex-1 space-y-4">
              {/* Top Row: View Toggle + Search */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* View Toggle */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCurrentView('tutorials')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                        currentView === 'tutorials'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Tutorials</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('collections')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${
                        currentView === 'collections'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      <Layers className="h-4 w-4" />
                      <span>Tech Stacks</span>
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder={`Search ${currentView === 'tutorials' ? 'tutorials' : 'tech stacks'}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Filter:</span>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[140px] text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-[120px] text-sm"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    showFavorites
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 border border-gray-200'
                  }`}
                >
                  <span className={`text-yellow-500 ${showFavorites ? 'text-yellow-600' : ''}`}>★</span>
                  <span className="hidden sm:inline">Favorites</span>
                </button>

                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    showCompleted
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                  }`}
                >
                  <span className={`${showCompleted ? 'text-green-600' : 'text-gray-400'}`}>✓</span>
                  <span className="hidden sm:inline">Completed</span>
                </button>
              </div>
            </div>

            {/* Right Section: Action Buttons */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Action Label */}
              <span className="text-sm text-gray-600 font-medium">Action:</span>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Trash button */}
                <button
                  onClick={() => setIsTrashModalOpen(true)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors border relative ${
                    trashItems.length > 0
                      ? 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                  title={`Trash (${trashItems.length} items)`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Trash</span>
                  {trashItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {trashItems.length > 99 ? '99+' : trashItems.length}
                    </span>
                  )}
                </button>

                {/* Shared Library button */}
                <button
                  onClick={() => setIsSharedModalOpen(true)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors border relative ${
                    sharedMarkdownFiles.length > 0
                      ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                  title={`Shared Library (${sharedMarkdownFiles.length} files)`}
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Shared</span>
                  {sharedMarkdownFiles.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {sharedMarkdownFiles.length > 99 ? '99+' : sharedMarkdownFiles.length}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={async () => {
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
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors border border-purple-200"
                  title="Download React Getting Started Example"
                >
                  <span>📥</span>
                  <span className="hidden sm:inline text-sm">Example</span>
                </button>
                
                <button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.md,.markdown';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (!file) return;

                      if (!file.name.toLowerCase().endsWith('.md')) {
                        alert('Please select a markdown (.md) file');
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const content = e.target?.result as string;
                        handleMarkdownUpload(content, file.name);
                      };
                      reader.readAsText(file);
                    };
                    input.click();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors border border-green-200"
                >
                  <span>📤</span>
                  <span className="hidden sm:inline text-sm">Upload</span>
                </button>

                {/* AI Tutorial Generator Button - only for tutorials view */}
                {currentView === 'tutorials' && (
                  <button
                    onClick={handleCreateWithAI}
                    className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all border border-purple-300 shadow-sm"
                    title="Generate tutorial with AI"
                  >
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline text-sm">AI Generate</span>
                  </button>
                )}
                
                <button
                  onClick={currentView === 'tutorials' ? handleCreateNew : handleCreateNewCollection}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors border border-blue-200"
                >
                  <span>➕</span>
                  <span className="hidden sm:inline text-sm">
                    {currentView === 'tutorials' ? 'New Tutorial' : 'New Collection'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance indicator */}
        {useVirtualization && currentView === 'tutorials' && (
          <div className="mb-6 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ⚡ Virtualized rendering for optimal performance ({total} tutorials)
            </span>
          </div>
        )}

        {/* Content Grid */}
        {currentView === 'tutorials' ? (
          // Tutorial Grid
          displayTutorials.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No tutorials found</h3>
              <p className="text-gray-400 mb-6">
                {stats.total === 0 
                  ? "Get started by creating your first tutorial, uploading a markdown file, browsing shared content, or generating one with AI"
                  : "Try adjusting your filters or search terms"
                }
              </p>
              {stats.total === 0 && (
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleCreateNew}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Tutorial
                  </button>
                  <button
                    onClick={() => setIsSharedModalOpen(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Browse Shared Library
                  </button>
                  <button
                    onClick={handleCreateWithAI}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Generate with AI
                  </button>
                </div>
              )}
            </div>
          ) : useVirtualization ? (
            <VirtualizedTutorialGrid
              tutorials={displayTutorials}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onToggleFavorite={handleToggleFavorite}
              onView={handleView}
              onDownloadMarkdown={handleDownloadMarkdown}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
                {displayTutorials.map(tutorial => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorial={tutorial}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onToggleFavorite={handleToggleFavorite}
                    onView={handleView}
                    onDownloadMarkdown={handleDownloadMarkdown}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={total}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              )}
            </>
          )
        ) : (
          // Tech Stack Collections Grid
          techStackCollections.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No tech stack collections found</h3>
              <p className="text-gray-400 mb-6">
                Create your first tech stack collection to organize related tutorials
              </p>
              <button
                onClick={handleCreateNewCollection}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
              {techStackCollections.map(collection => {
                const collectionTutorials = allTutorials.filter(t => collection.tutorialIds.includes(t.id));
                const completedCount = collectionTutorials.filter(t => t.isCompleted).length;
                
                return (
                  <TechStackCard
                    key={collection.id}
                    collection={collection}
                    tutorialCount={collectionTutorials.length}
                    completedCount={completedCount}
                    onEdit={handleEditCollection}
                    onDelete={handleDeleteCollection}
                    onToggleComplete={handleToggleCollectionComplete}
                    onToggleFavorite={handleToggleCollectionFavorite}
                    onView={handleViewCollection}
                  />
                );
              })}
            </div>
          )
        )}

        {/* Modals */}
        <TutorialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          tutorial={editingTutorial}
        />

        <AITutorialModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onSave={handleAISave}
        />

        <SharedMarkdownModal
          isOpen={isSharedModalOpen}
          onClose={() => setIsSharedModalOpen(false)}
          sharedFiles={sharedMarkdownFiles}
          onDownload={handleSharedMarkdownDownload}
          onImport={handleSharedMarkdownImport}
        />

        <TechStackModal
          isOpen={isCollectionModalOpen}
          onClose={() => setIsCollectionModalOpen(false)}
          onSave={handleSaveCollection}
          collection={editingCollection}
          availableTutorials={allTutorials}
        />

        <TrashModal
          isOpen={isTrashModalOpen}
          onClose={() => setIsTrashModalOpen(false)}
          trashItems={trashItems}
          onRestore={handleRestoreFromTrash}
          onPermanentDelete={handlePermanentDelete}
          onEmptyTrash={handleEmptyTrash}
        />

        {/* Viewers */}
        <TutorialViewer
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          tutorial={viewingTutorial}
          onToggleComplete={handleToggleComplete}
          onToggleFavorite={handleToggleFavorite}
          onDownloadMarkdown={handleDownloadMarkdown}
        />

        <TechStackViewer
          isOpen={isCollectionViewerOpen}
          onClose={() => setIsCollectionViewerOpen(false)}
          collection={viewingCollection}
          tutorials={viewingCollection ? allTutorials.filter(t => viewingCollection.tutorialIds.includes(t.id)) : []}
          onToggleComplete={handleToggleCollectionComplete}
          onToggleFavorite={handleToggleCollectionFavorite}
          onViewTutorial={handleView}
          onToggleTutorialComplete={handleToggleComplete}
        />
      </div>
    </div>
  );
}

export default App;