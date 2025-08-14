import { SampleTutorial } from './react';

export const springBootTutorials: SampleTutorial[] = [
  {
    title: 'Spring Boot REST API 설계 및 구현',
    description: '실무에서 사용하는 RESTful API 설계 원칙과 Spring Boot 구현 방법',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 120,
    tags: ['spring-boot', 'rest-api', 'controller', 'service', 'repository'],
    content: 'Spring Boot를 사용한 RESTful API 설계 및 구현 방법을 학습합니다. Controller, Service, Repository 패턴과 HTTP 메서드별 구현 방법을 다룹니다.'
  },
  {
    title: 'Spring Security JWT 인증 구현',
    description: 'JWT 토큰 기반 인증 시스템을 Spring Security로 구현하기',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 150,
    tags: ['spring-security', 'jwt', 'authentication', 'authorization', 'security'],
    content: 'Spring Security와 JWT를 활용한 토큰 기반 인증 시스템 구현 방법을 학습합니다. 로그인, 토큰 발급, 인증 필터 구현을 다룹니다.'
  },
  {
    title: 'Spring Data JPA 실무 활용',
    description: 'JPA와 Hibernate를 활용한 데이터베이스 연동 및 최적화',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 135,
    tags: ['spring-data-jpa', 'hibernate', 'database', 'entity', 'repository'],
    content: 'Spring Data JPA를 활용한 엔티티 설계, 연관관계 매핑, 쿼리 최적화 방법을 실무 관점에서 학습합니다.'
  },
  {
    title: 'Spring Boot 예외 처리 전략',
    description: '글로벌 예외 처리와 커스텀 예외 클래스 설계',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 90,
    tags: ['exception-handling', 'global-exception', 'error-response', 'validation'],
    content: '@ControllerAdvice를 활용한 글로벌 예외 처리와 비즈니스 로직에 맞는 커스텀 예외 설계 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 설정 관리 (Profiles & Properties)',
    description: '환경별 설정 관리와 외부 설정 파일 활용 방법',
    category: 'Spring Boot',
    difficulty: 'Beginner',
    duration: 75,
    tags: ['configuration', 'profiles', 'properties', 'yaml', 'environment'],
    content: 'Spring Boot의 Profile과 Properties를 활용한 환경별 설정 관리 방법과 외부 설정 파일 활용법을 학습합니다.'
  },
  {
    title: 'Spring Boot 테스트 작성 가이드',
    description: '단위 테스트, 통합 테스트, Mock 테스트 작성 방법',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 110,
    tags: ['testing', 'junit', 'mockito', 'test-slice', 'integration-test'],
    content: 'Spring Boot 애플리케이션의 효과적인 테스트 작성 방법을 학습합니다. @WebMvcTest, @DataJpaTest 등 테스트 슬라이스 활용법을 다룹니다.'
  },
  {
    title: 'Spring Boot 캐싱 전략 구현',
    description: 'Redis와 Spring Cache를 활용한 성능 최적화',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 125,
    tags: ['caching', 'redis', 'spring-cache', 'performance', 'optimization'],
    content: 'Spring Cache Abstraction과 Redis를 활용한 캐싱 전략 구현 방법과 성능 최적화 기법을 학습합니다.'
  },
  {
    title: 'Spring Boot 비동기 처리 (@Async)',
    description: '비동기 메서드와 스레드 풀 설정으로 성능 향상',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 100,
    tags: ['async', 'threading', 'performance', 'concurrent', 'executor'],
    content: '@Async 어노테이션을 활용한 비동기 처리 구현과 커스텀 스레드 풀 설정 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 스케줄링 작업 구현',
    description: '@Scheduled를 활용한 배치 작업과 크론 표현식',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 85,
    tags: ['scheduling', 'cron', 'batch', 'scheduled', 'task'],
    content: 'Spring Boot의 스케줄링 기능을 활용한 정기 작업 구현과 크론 표현식 활용 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 파일 업로드/다운로드',
    description: '멀티파트 파일 처리와 스토리지 연동 구현',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 95,
    tags: ['file-upload', 'multipart', 'storage', 'download', 'validation'],
    content: 'Spring Boot에서 파일 업로드/다운로드 기능 구현과 파일 검증, 스토리지 연동 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 이메일 발송 시스템',
    description: 'JavaMailSender를 활용한 이메일 발송 기능 구현',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 80,
    tags: ['email', 'mail-sender', 'template', 'smtp', 'notification'],
    content: 'Spring Boot에서 이메일 발송 기능을 구현하고 HTML 템플릿과 첨부파일 처리 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 로깅 전략 및 모니터링',
    description: 'Logback 설정과 애플리케이션 모니터링 구현',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 105,
    tags: ['logging', 'logback', 'monitoring', 'actuator', 'metrics'],
    content: 'Logback을 활용한 로깅 전략 수립과 Spring Boot Actuator를 통한 애플리케이션 모니터링 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 데이터베이스 마이그레이션',
    description: 'Flyway/Liquibase를 활용한 DB 스키마 버전 관리',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 115,
    tags: ['migration', 'flyway', 'liquibase', 'database', 'versioning'],
    content: 'Flyway 또는 Liquibase를 활용한 데이터베이스 스키마 버전 관리와 마이그레이션 전략을 학습합니다.'
  },
  {
    title: 'Spring Boot 트랜잭션 관리',
    description: '@Transactional 어노테이션과 트랜잭션 전파 속성',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 120,
    tags: ['transaction', 'transactional', 'propagation', 'isolation', 'rollback'],
    content: 'Spring의 트랜잭션 관리 메커니즘과 @Transactional 어노테이션의 다양한 속성 활용 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 검증(Validation) 구현',
    description: 'Bean Validation과 커스텀 검증 로직 구현',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 90,
    tags: ['validation', 'bean-validation', 'custom-validator', 'annotation'],
    content: 'Bean Validation API를 활용한 데이터 검증과 커스텀 검증 어노테이션 구현 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 페이징 및 정렬 구현',
    description: 'Pageable을 활용한 효율적인 데이터 조회',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 85,
    tags: ['pagination', 'sorting', 'pageable', 'performance', 'query'],
    content: 'Spring Data의 Pageable을 활용한 페이징과 정렬 기능 구현 및 성능 최적화 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 다중 데이터소스 설정',
    description: '여러 데이터베이스 연결과 트랜잭션 관리',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 140,
    tags: ['multiple-datasource', 'database', 'configuration', 'transaction'],
    content: '여러 데이터베이스를 연결하고 각각의 트랜잭션을 관리하는 다중 데이터소스 설정 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot 국제화(i18n) 구현',
    description: '다국어 지원과 메시지 소스 관리',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 75,
    tags: ['internationalization', 'i18n', 'locale', 'message-source'],
    content: 'Spring Boot에서 국제화 기능을 구현하고 다국어 메시지를 관리하는 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot WebSocket 실시간 통신',
    description: 'WebSocket과 STOMP를 활용한 실시간 채팅 구현',
    category: 'Spring Boot',
    difficulty: 'Advanced',
    duration: 130,
    tags: ['websocket', 'stomp', 'real-time', 'messaging', 'chat'],
    content: 'Spring Boot에서 WebSocket과 STOMP 프로토콜을 활용한 실시간 통신 기능 구현 방법을 학습합니다.'
  },
  {
    title: 'Spring Boot Docker 컨테이너화',
    description: 'Docker를 활용한 Spring Boot 애플리케이션 배포',
    category: 'Spring Boot',
    difficulty: 'Intermediate',
    duration: 100,
    tags: ['docker', 'containerization', 'deployment', 'dockerfile'],
    content: 'Spring Boot 애플리케이션을 Docker 컨테이너로 패키징하고 배포하는 방법을 학습합니다.'
  }
];