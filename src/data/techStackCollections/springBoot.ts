import { TechStackCollection } from '../../types/tutorial';

export const springBootTechStackCollections: Omit<TechStackCollection, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Spring Boot 엔터프라이즈 개발',
    description: '대규모 엔터프라이즈 애플리케이션 개발을 위한 Spring Boot 핵심 기술 스택',
    icon: '🏢',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['spring-boot', 'enterprise', 'microservices', 'security', 'jpa'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot REST API 마스터',
    description: '실무에서 바로 사용할 수 있는 RESTful API 설계부터 배포까지',
    icon: '🌐',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['spring-boot', 'rest-api', 'controller', 'validation', 'testing'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 보안 & 인증',
    description: 'Spring Security를 활용한 완벽한 보안 시스템 구축',
    icon: '🛡️',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['spring-security', 'jwt', 'oauth', 'authentication', 'authorization'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 데이터 처리 전문가',
    description: 'JPA, 캐싱, 트랜잭션을 활용한 고성능 데이터 처리',
    icon: '💾',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['spring-data-jpa', 'caching', 'transaction', 'database', 'performance'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 성능 최적화',
    description: '비동기 처리, 캐싱, 모니터링을 통한 애플리케이션 성능 향상',
    icon: '⚡',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['performance', 'async', 'caching', 'monitoring', 'optimization'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 테스팅 전략',
    description: '단위 테스트부터 통합 테스트까지 완벽한 테스팅 가이드',
    icon: '🧪',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['testing', 'junit', 'mockito', 'integration-test', 'tdd'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 운영 & 배포',
    description: '프로덕션 환경 배포와 운영을 위한 실무 기술',
    icon: '🚀',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['deployment', 'docker', 'monitoring', 'logging', 'configuration'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 실시간 시스템',
    description: 'WebSocket, 스케줄링, 이벤트 처리를 활용한 실시간 애플리케이션',
    icon: '⏱️',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['websocket', 'scheduling', 'real-time', 'messaging', 'events'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 파일 & 이메일 처리',
    description: '파일 업로드/다운로드와 이메일 발송 시스템 구현',
    icon: '📎',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Intermediate',
    tags: ['file-upload', 'email', 'storage', 'multipart', 'notification'],
    isCompleted: false,
    isFavorite: false
  },
  {
    name: 'Spring Boot 국제화 & 다중 DB',
    description: '글로벌 서비스를 위한 국제화와 다중 데이터베이스 연동',
    icon: '🌍',
    color: '#6DB33F',
    tutorialIds: [],
    estimatedDuration: 0,
    difficulty: 'Advanced',
    tags: ['internationalization', 'multiple-datasource', 'i18n', 'global', 'database'],
    isCompleted: false,
    isFavorite: false
  }
];