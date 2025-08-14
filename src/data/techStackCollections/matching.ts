/**
 * Tutorial matching utilities for tech stack collections
 */

interface TutorialData {
  id: number;
  category: string;
  tags: string[];
  duration: number;
  title: string;
}

interface CollectionData {
  tags: string[];
  [key: string]: any;
}

/**
 * Advanced matching logic for Spring Boot related collections
 */
export const matchSpringBootTutorials = (
  collection: CollectionData,
  tutorials: TutorialData[]
): TutorialData[] => {
  return tutorials.filter(tutorial => {
    const tutorialKeywords = [
      tutorial.category.toLowerCase(),
      ...tutorial.tags.map(tag => tag.toLowerCase()),
      tutorial.title.toLowerCase()
    ];

    // Check if this is a Spring Boot tutorial
    const isSpringBootTutorial = tutorial.category.toLowerCase().includes('spring') ||
                               tutorial.tags.some(tag => tag.toLowerCase().includes('spring'));
    
    if (!isSpringBootTutorial) return false;

    // More specific matching for Spring Boot tutorials
    return collection.tags.some(collectionTag => {
      const tag = collectionTag.toLowerCase();
      return tutorialKeywords.some(keyword => {
        // Exact matches
        if (keyword === tag) return true;
        
        // Partial matches for compound tags
        if (tag.includes('-') && keyword.includes(tag.replace('-', ''))) return true;
        if (keyword.includes('-') && tag.includes(keyword.replace('-', ''))) return true;
        
        // Special cases for Spring Boot
        if (tag === 'spring-boot' && (keyword.includes('spring') || keyword.includes('boot'))) return true;
        if (tag === 'spring-security' && (keyword.includes('security') || keyword.includes('jwt') || keyword.includes('auth'))) return true;
        if (tag === 'spring-data-jpa' && (keyword.includes('jpa') || keyword.includes('hibernate') || keyword.includes('data'))) return true;
        
        // Performance related keywords
        if (tag === 'performance' && (keyword.includes('async') || keyword.includes('cache') || keyword.includes('optimization'))) return true;
        
        // Testing related keywords
        if (tag === 'testing' && (keyword.includes('test') || keyword.includes('junit') || keyword.includes('mock'))) return true;
        
        // Deployment related keywords
        if (tag === 'deployment' && (keyword.includes('docker') || keyword.includes('deploy') || keyword.includes('container'))) return true;
        
        return false;
      });
    });
  });
};

/**
 * Default matching logic for general collections
 */
export const matchGeneralTutorials = (
  collection: CollectionData,
  tutorials: TutorialData[]
): TutorialData[] => {
  return tutorials.filter(tutorial => {
    const tutorialKeywords = [
      tutorial.category.toLowerCase(),
      ...tutorial.tags.map(tag => tag.toLowerCase()),
      tutorial.title.toLowerCase()
    ];

    return collection.tags.some(collectionTag => 
      tutorialKeywords.some(keyword => 
        keyword.includes(collectionTag.toLowerCase()) || 
        collectionTag.toLowerCase().includes(keyword)
      )
    );
  });
};

/**
 * Main matching function that determines which strategy to use
 */
export const matchTutorialsToCollection = (
  collection: CollectionData,
  tutorials: TutorialData[]
): TutorialData[] => {
  // Check if this is a Spring Boot collection
  const isSpringBootCollection = collection.tags.some(tag => 
    ['spring-boot', 'spring-security', 'spring-data-jpa'].includes(tag.toLowerCase())
  );

  if (isSpringBootCollection) {
    return matchSpringBootTutorials(collection, tutorials);
  } else {
    return matchGeneralTutorials(collection, tutorials);
  }
};

/**
 * Calculate estimated duration for a collection based on matched tutorials
 */
export const calculateEstimatedDuration = (matchedTutorials: TutorialData[]): number => {
  return matchedTutorials.reduce((total, tutorial) => total + tutorial.duration, 0);
};

/**
 * Get tutorial IDs from matched tutorials
 */
export const getTutorialIds = (matchedTutorials: TutorialData[]): number[] => {
  return matchedTutorials.map(tutorial => tutorial.id);
};