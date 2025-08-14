export interface SampleTutorial {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  tags: string[];
  content: string;
}

export const reactTutorials: SampleTutorial[] = [
  {
    title: 'React Hooks Fundamentals',
    description: 'Learn the basics of React Hooks including useState, useEffect, and custom hooks',
    category: 'React',
    difficulty: 'Beginner',
    duration: 45,
    tags: ['react', 'hooks', 'javascript'],
    content: 'This tutorial covers the fundamentals of React Hooks including useState for state management, useEffect for side effects, and how to create custom hooks for reusable logic.'
  },
  {
    title: 'React Context API & State Management',
    description: 'Master global state management with React Context API and useReducer',
    category: 'React',
    difficulty: 'Intermediate',
    duration: 75,
    tags: ['react', 'context', 'state-management', 'usereducer'],
    content: 'Learn advanced state management patterns using React Context API and useReducer hook for complex applications.'
  },
  {
    title: 'React Performance Optimization',
    description: 'Optimize React applications for better performance and user experience',
    category: 'React',
    difficulty: 'Advanced',
    duration: 95,
    tags: ['react', 'performance', 'optimization', 'memo', 'usecallback'],
    content: 'Advanced React performance optimization techniques including React.memo, useMemo, useCallback, and code splitting.'
  },
  {
    title: 'React Router v6 Navigation',
    description: 'Implement client-side routing with React Router v6',
    category: 'React',
    difficulty: 'Beginner',
    duration: 60,
    tags: ['react', 'router', 'navigation', 'spa'],
    content: 'Complete guide to React Router v6 including nested routes, protected routes, and navigation patterns.'
  },
  {
    title: 'React Server Components',
    description: 'Explore React Server Components and their benefits',
    category: 'React',
    difficulty: 'Advanced',
    duration: 110,
    tags: ['react', 'server-components', 'ssr', 'performance'],
    content: 'Deep dive into React Server Components, their architecture, and how they improve application performance.'
  },
  {
    title: 'React Custom Hooks Patterns',
    description: 'Create reusable logic with advanced custom hooks patterns',
    category: 'React',
    difficulty: 'Intermediate',
    duration: 85,
    tags: ['react', 'custom-hooks', 'patterns', 'reusability'],
    content: 'Learn to create powerful custom hooks for data fetching, form handling, and complex state logic.'
  },
  {
    title: 'React Testing with Jest & RTL',
    description: 'Comprehensive testing strategies for React applications',
    category: 'React',
    difficulty: 'Intermediate',
    duration: 80,
    tags: ['react', 'testing', 'jest', 'rtl', 'tdd'],
    content: 'Learn testing best practices for React applications using Jest and React Testing Library.'
  },
  {
    title: 'React Suspense & Concurrent Features',
    description: 'Master React 18 concurrent features and Suspense',
    category: 'React',
    difficulty: 'Advanced',
    duration: 100,
    tags: ['react', 'suspense', 'concurrent', 'react18'],
    content: 'Learn React 18 concurrent features including Suspense, concurrent rendering, and automatic batching.'
  },
  {
    title: 'React Error Boundaries',
    description: 'Handle errors gracefully in React applications',
    category: 'React',
    difficulty: 'Intermediate',
    duration: 55,
    tags: ['react', 'error-boundaries', 'error-handling', 'debugging'],
    content: 'Learn to implement error boundaries for better error handling and user experience in React apps.'
  },
  {
    title: 'React Native Mobile Development',
    description: 'Build cross-platform mobile apps with React Native',
    category: 'React Native',
    difficulty: 'Intermediate',
    duration: 140,
    tags: ['react-native', 'mobile', 'ios', 'android'],
    content: 'Complete React Native guide for building cross-platform mobile applications.'
  },
  {
    title: 'React Native Navigation',
    description: 'Implement navigation patterns in React Native apps',
    category: 'React Native',
    difficulty: 'Intermediate',
    duration: 80,
    tags: ['react-native', 'navigation', 'mobile', 'routing'],
    content: 'Master React Native navigation including stack, tab, and drawer navigation patterns.'
  }
];