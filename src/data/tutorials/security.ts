import { SampleTutorial } from './react';

export const securityTutorials: SampleTutorial[] = [
  {
    title: 'Web Application Security Fundamentals',
    description: 'Learn essential web security principles and common vulnerabilities',
    category: 'Security',
    difficulty: 'Intermediate',
    duration: 95,
    tags: ['security', 'web', 'owasp', 'vulnerabilities'],
    content: 'Comprehensive guide to web application security including OWASP Top 10 vulnerabilities and mitigation strategies.'
  },
  {
    title: 'JWT Authentication & Authorization',
    description: 'Implement secure authentication with JSON Web Tokens',
    category: 'Security',
    difficulty: 'Intermediate',
    duration: 80,
    tags: ['jwt', 'authentication', 'authorization', 'security'],
    content: 'Learn JWT implementation for secure authentication and authorization in web applications.'
  },
  {
    title: 'OAuth 2.0 & OpenID Connect',
    description: 'Implement OAuth 2.0 and OpenID Connect for secure API access',
    category: 'Security',
    difficulty: 'Advanced',
    duration: 120,
    tags: ['oauth', 'openid-connect', 'api-security', 'sso'],
    content: 'Master OAuth 2.0 and OpenID Connect protocols for secure API access and single sign-on.'
  },
  {
    title: 'Cryptography for Developers',
    description: 'Understand cryptographic principles and their practical applications',
    category: 'Security',
    difficulty: 'Advanced',
    duration: 135,
    tags: ['cryptography', 'encryption', 'hashing', 'digital-signatures'],
    content: 'Learn cryptographic concepts including symmetric/asymmetric encryption, hashing, and digital signatures.'
  },
  {
    title: 'Secure API Design',
    description: 'Design and implement secure REST and GraphQL APIs',
    category: 'Security',
    difficulty: 'Intermediate',
    duration: 100,
    tags: ['api-security', 'rest', 'graphql', 'rate-limiting'],
    content: 'Best practices for designing secure APIs including authentication, authorization, and rate limiting.'
  }
];