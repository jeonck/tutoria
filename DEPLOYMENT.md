# TUTORIA - GitHub Pages 배포 가이드

## 📋 목차
1. [사전 준비](#사전-준비)
2. [배포 설정](#배포-설정)
3. [자동 배포 (권장)](#자동-배포-권장)
4. [수동 배포](#수동-배포)
5. [트러블슈팅](#트러블슈팅)

---

## 사전 준비

### 1. 요구사항
- GitHub 계정
- Git이 설치된 로컬 환경
- Node.js v16 이상

### 2. 프로젝트 확인
```bash
# 프로젝트 디렉토리로 이동
cd /Users/1102680/ws/claude-project/tutoria

# 의존성 설치 확인
npm install

# 로컬 빌드 테스트
npm run build
```

---

## 배포 설정

### 1. Vite 설정 수정

`vite.config.ts` 파일에서 GitHub Pages용 기본 경로 설정:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/tutoria/', // GitHub Pages 저장소명과 일치해야 함
  plugins: [react()],
  // ... 기타 설정
});
```

### 2. GitHub 저장소 설정

#### A. 새 저장소 생성 (아직 없는 경우)
1. GitHub에서 새 저장소 생성: `tutoria`
2. 로컬 Git 초기화 및 연결:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/tutoria.git
git push -u origin main
```

#### B. 기존 저장소 사용 (이미 있는 경우)
```bash
git remote -v  # 현재 원격 저장소 확인
git push origin main  # 최신 코드 푸시
```

---

## 자동 배포 (권장)

### 1. GitHub Actions 워크플로우 설정

`.github/workflows/deploy.yml` 파일이 이미 생성되어 있습니다:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write
    
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./dist
        
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### 2. GitHub Pages 설정

1. **GitHub 저장소 접속**
2. **Settings** 탭 클릭
3. 좌측 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서 **"GitHub Actions"** 선택
5. 설정 저장

### 3. 자동 배포 실행

```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

**결과**: 푸시 후 자동으로 GitHub Actions가 실행되어 배포됩니다.

---

## 수동 배포

### 1. gh-pages 패키지 설치

```bash
# 개발 의존성으로 설치
npm install --save-dev gh-pages

# 또는 글로벌 설치
npm install -g gh-pages
```

### 2. 배포 스크립트 사용

`package.json`에 이미 추가된 배포 스크립트 사용:

```bash
npm run deploy
```

### 3. 수동 배포 설정 (GitHub)

자동 배포를 사용하지 않는 경우:

1. **GitHub 저장소** → **Settings** → **Pages**
2. **Source**: "Deploy from a branch" 선택
3. **Branch**: "gh-pages" 선택
4. **Folder**: "/ (root)" 선택

---

## 배포 확인

### 1. 배포 상태 확인

- **GitHub Actions 탭**에서 워크플로우 실행 상태 확인
- **Settings > Pages**에서 배포 URL 확인

### 2. 배포된 사이트 접속

```
https://[YOUR_GITHUB_USERNAME].github.io/tutoria/
```

### 3. 배포 시간

- 첫 번째 배포: 5-10분 소요
- 이후 배포: 2-5분 소요

---

## 트러블슈팅

### 1. 빈 페이지가 표시되는 경우

**원인**: Vite base 경로 설정 문제

**해결책**:
```typescript
// vite.config.ts
export default defineConfig({
  base: '/tutoria/', // 저장소명과 정확히 일치해야 함
  // ...
});
```

### 2. 예시 파일 다운로드 404 오류

**원인**: GitHub Pages에서 상대 경로 문제

**해결책**: 코드에서 `import.meta.env.BASE_URL` 사용
```javascript
// 올바른 방법
const basePath = import.meta.env.BASE_URL || '/';
const response = await fetch(`${basePath}examples/react-getting-started.md`);

// 잘못된 방법
const response = await fetch('/examples/react-getting-started.md');
```

### 3. SPA 라우팅 404 오류

**원인**: SPA 라우팅 문제

**해결책**: `public/404.html` 생성:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TUTORIA</title>
  <script type="text/javascript">
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body>
</body>
</html>
```

### 3. GitHub Actions 실행 실패

**확인사항**:
1. **저장소 권한**: Settings > Actions > General에서 권한 확인
2. **브랜치명**: `main` 브랜치에서 푸시했는지 확인
3. **package.json**: 스크립트가 올바른지 확인

### 4. 빌드 실패

**확인사항**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

---

## 배포 자동화 스크립트

편리한 배포를 위한 bash 스크립트 (`deploy.sh`):

```bash
#!/bin/bash

echo "🚀 Starting deployment process..."

# 변경사항 확인
if [[ `git status --porcelain` ]]; then
  echo "📝 Committing changes..."
  git add .
  read -p "Enter commit message: " commit_message
  git commit -m "$commit_message"
fi

# 푸시 및 배포
echo "📤 Pushing to GitHub..."
git push origin main

echo "⏳ Deployment started. Check GitHub Actions for progress."
echo "🌐 Site will be available at: https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^/.]*\).*/\1/'/).github.io/tutoria/"
```

**사용법**:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 도움이 필요한 경우

1. **GitHub Actions 로그** 확인
2. **GitHub Pages 상태** 확인
3. **브라우저 개발자 도구** 콘솔 확인
4. **로컬 빌드** 테스트 후 배포

---

## 🎉 배포 완료 체크리스트

- [ ] Vite 설정에 올바른 base 경로 설정
- [ ] GitHub 저장소에 코드 푸시
- [ ] GitHub Pages 설정 완료
- [ ] GitHub Actions 워크플로우 실행 성공
- [ ] 배포된 사이트 정상 접속 확인
- [ ] 모든 기능 정상 작동 확인

**축하합니다! 🎊 TUTORIA가 성공적으로 배포되었습니다!**
