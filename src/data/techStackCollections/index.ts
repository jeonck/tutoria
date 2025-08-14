import { TechStackCollection } from '../../types/tutorial';
import { basicTechStackCollections } from './basic';
import { springBootTechStackCollections } from './springBoot';
import { 
  matchTutorialsToCollection, 
  calculateEstimatedDuration, 
  getTutorialIds 
} from './matching';

/**
 * Get all default tech stack collections
 */
export const getDefaultTechStackCollections = (): Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    ...basicTechStackCollections,
    ...springBootTechStackCollections
  ];
};

/**
 * Match tutorials to collections and calculate durations
 */
export const matchTutorialsToCollections = (
  collections: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>[],
  tutorials: { id: number; category: string; tags: string[]; duration: number; title: string }[]
): Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return collections.map(collection => {
    // Match tutorials to this collection
    const matchingTutorials = matchTutorialsToCollection(collection, tutorials);
    
    // Calculate metrics
    const tutorialIds = getTutorialIds(matchingTutorials);
    const estimatedDuration = calculateEstimatedDuration(matchingTutorials);

    return {
      ...collection,
      tutorialIds,
      estimatedDuration
    };
  });
};

// Export individual collections for specific use cases
export { basicTechStackCollections } from './basic';
export { springBootTechStackCollections } from './springBoot';

// Export matching utilities
export { 
  matchTutorialsToCollection,
  calculateEstimatedDuration,
  getTutorialIds
} from './matching';

// Collection metadata for easy management
export const techStackCollectionCategories = {
  'Basic': basicTechStackCollections,
  'Spring Boot': springBootTechStackCollections
} as const;

// Helper function to get collections by category
export const getCollectionsByCategory = (category: keyof typeof techStackCollectionCategories) => {
  return techStackCollectionCategories[category] || [];
};

// Statistics helper
export const getCollectionStats = () => {
  const allCollections = getDefaultTechStackCollections();
  
  return {
    total: allCollections.length,
    byCategory: Object.entries(techStackCollectionCategories).map(([name, collections]) => ({
      name,
      count: collections.length
    })),
    byDifficulty: {
      Beginner: allCollections.filter(c => c.difficulty === 'Beginner').length,
      Intermediate: allCollections.filter(c => c.difficulty === 'Intermediate').length,
      Advanced: allCollections.filter(c => c.difficulty === 'Advanced').length
    }
  };
};