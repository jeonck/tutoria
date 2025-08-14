// Tutorial category imports
import { reactTutorials } from './react';
import { springBootTutorials } from './springBoot';
import { typescriptTutorials } from './typescript';
import { backendTutorials } from './backend';
import { frontendTutorials } from './frontend';
import { databaseTutorials } from './database';
import { devopsTutorials } from './devops';
import { mobileTutorials } from './mobile';
import { securityTutorials } from './security';
import { aiTutorials } from './ai';

// Re-export the SampleTutorial interface
export type { SampleTutorial } from './react';

// Combine all tutorials
export const getAllSampleTutorials = () => {
  return [
    ...reactTutorials,
    ...springBootTutorials,
    ...typescriptTutorials,
    ...backendTutorials,
    ...frontendTutorials,
    ...databaseTutorials,
    ...devopsTutorials,
    ...mobileTutorials,
    ...securityTutorials,
    ...aiTutorials
  ];
};

// Export individual categories for specific use cases
export {
  reactTutorials,
  springBootTutorials,
  typescriptTutorials,
  backendTutorials,
  frontendTutorials,
  databaseTutorials,
  devopsTutorials,
  mobileTutorials,
  securityTutorials,
  aiTutorials
};

// Category metadata for easy management
export const tutorialCategories = {
  'React': reactTutorials,
  'Spring Boot': springBootTutorials,
  'TypeScript': typescriptTutorials,
  'Backend': backendTutorials,
  'Frontend': frontendTutorials,
  'Database': databaseTutorials,
  'DevOps': devopsTutorials,
  'Mobile': mobileTutorials,
  'Security': securityTutorials,
  'AI/ML': aiTutorials
} as const;

// Helper function to get tutorials by category
export const getTutorialsByCategory = (category: keyof typeof tutorialCategories) => {
  return tutorialCategories[category] || [];
};

// Statistics helper
export const getTutorialStats = () => {
  const allTutorials = getAllSampleTutorials();
  
  return {
    total: allTutorials.length,
    byCategory: Object.entries(tutorialCategories).map(([name, tutorials]) => ({
      name,
      count: tutorials.length
    })),
    byDifficulty: {
      Beginner: allTutorials.filter(t => t.difficulty === 'Beginner').length,
      Intermediate: allTutorials.filter(t => t.difficulty === 'Intermediate').length,
      Advanced: allTutorials.filter(t => t.difficulty === 'Advanced').length
    },
    totalDuration: allTutorials.reduce((sum, t) => sum + t.duration, 0)
  };
};