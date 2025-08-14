import { TechStackCollection } from '../../types/tutorial';

export const basicTechStackCollections: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Full-Stack React Development',
    description: 'Complete learning path for building modern React applications with backend integration',
    icon: '⚛️',
    color: '#61DAFB',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['react', 'fullstack', 'javascript', 'frontend', 'backend'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Modern JavaScript Mastery',
    description: 'Master modern JavaScript features and best practices for professional development',
    icon: '🚀',
    color: '#F7DF1E',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['javascript', 'es6', 'async', 'modules', 'fundamentals'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'DevOps & Cloud Deployment',
    description: 'Learn containerization, CI/CD, and cloud deployment strategies',
    icon: '☁️',
    color: '#FF9900',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['devops', 'docker', 'kubernetes', 'aws', 'ci-cd'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Mobile App Development',
    description: 'Cross-platform mobile development with React Native and Flutter',
    icon: '📱',
    color: '#02569B',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['mobile', 'react-native', 'flutter', 'ios', 'android'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Database & Backend APIs',
    description: 'Build robust backend systems with databases and RESTful APIs',
    icon: '🗄️',
    color: '#336791',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['database', 'api', 'backend', 'sql', 'nosql'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'AI & Machine Learning',
    description: 'Introduction to AI/ML concepts and practical implementations',
    icon: '🤖',
    color: '#FF6F00',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['ai', 'machine-learning', 'python', 'tensorflow', 'data-science'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Web Security Essentials',
    description: 'Essential security practices for web applications and APIs',
    icon: '🔒',
    color: '#DC143C',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['security', 'authentication', 'oauth', 'encryption', 'web-security'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'TypeScript Professional',
    description: 'Advanced TypeScript patterns for large-scale applications',
    icon: '📘',
    color: '#3178C6',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['typescript', 'types', 'patterns', 'advanced', 'professional'],
    isCompleted: false,
    isFavorite: false
  }
];