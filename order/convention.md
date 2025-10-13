# 개발 컨벤션 가이드

> 네이버 핵데이 컨벤션을 기반으로 한 멀티 스택 개발 가이드

## 📝 공통 규칙

### 파일 및 인코딩
- **인코딩**: UTF-8 사용
- **줄바꿈**: LF (Line Feed) 사용
- **파일 끝**: 개행 문자로 종료
- **최대 줄 길이**: 120자

### 네이밍 컨벤션
- **영문자, 숫자, 언더스코어만** 사용
- **한글 발음 그대로 영어로 쓰지 않기** (예: ❌ `hoesa` → ✅ `company`)
- **의미 있는 이름** 사용 (단일 문자 변수 지양)

## 🏗️ 기술별 컨벤션

### Spring Boot / Java

#### 네이밍
```java
// 클래스: PascalCase
public class UserService {}

// 메서드/변수: camelCase
private String userName;
public void getUserInfo() {}

// 상수: UPPER_SNAKE_CASE
public static final String API_BASE_URL = "https://api.example.com";

// 패키지: lowercase
package com.example.userservice;
```

#### 코드 구조
- **한 파일 당 하나의 top-level 클래스**
- **명시적 import 사용** (와일드카드 import 금지)
- **레이어별 패키지 분리**: controller, service, repository, dto

#### 포맷팅
```java
// K&R 브레이스 스타일
if (condition) {
    doSomething();
} else {
    doSomethingElse();
}

// 연산자 주변 공백
int result = a + b * c;
```

**📚 상세 가이드**: [네이버 Java 컨벤션](https://naver.github.io/hackday-conventions-java/)

### React / TypeScript

#### 네이밍
```typescript
// 컴포넌트: PascalCase
export const UserProfile: React.FC = () => {};

// Props 인터페이스: PascalCase + Props 접미사
interface UserProfileProps {
  userId: string;
}

// 훅: camelCase + use 접두사
const useUserData = (userId: string) => {};

// 이벤트 핸들러: handle + 동작
const handleButtonClick = () => {};
```

#### 파일 구조
```
src/
├── components/          # 재사용 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   └── ui/            # UI 컴포넌트
├── pages/              # 페이지 컴포넌트
├── hooks/              # 커스텀 훅
├── utils/              # 유틸리티 함수
├── types/              # 타입 정의
└── api/                # API 관련
```

#### 타입 정의
```typescript
// 인터페이스 우선 사용
interface User {
  id: string;
  name: string;
  email: string;
}

// 유니온 타입은 type 사용
type Status = 'loading' | 'success' | 'error';
```

**📚 상세 가이드**: [Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### JavaScript

#### ES6+ 문법 우선 사용
```javascript
// const/let 사용 (var 금지)
const apiUrl = 'https://api.example.com';
let userData = null;

// 화살표 함수
const fetchUser = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/users/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

// 구조분해할당
const { name, email } = user;
const [first, ...rest] = items;
```

**📚 상세 가이드**: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

### CSS

#### 네이밍 (BEM 방법론)
```css
/* Block__Element--Modifier */
.user-card {}
.user-card__title {}
.user-card__title--highlighted {}
.user-card--compact {}
```

#### 속성 순서
```css
.example {
  /* 1. 포지셔닝 */
  position: absolute;
  top: 0;
  left: 0;

  /* 2. 박스 모델 */
  display: block;
  width: 100px;
  height: 100px;
  margin: 10px;
  padding: 10px;

  /* 3. 타이포그래피 */
  font-size: 16px;
  line-height: 1.5;

  /* 4. 비주얼 */
  background-color: #fff;
  border: 1px solid #ccc;

  /* 5. 기타 */
  opacity: 1;
  transition: all 0.3s;
}
```

**📚 상세 가이드**: [CSS Guidelines](https://cssguidelin.es/)

## 🗄️ 데이터베이스

### MySQL
```sql
-- 테이블명: snake_case
CREATE TABLE user_profiles (
  -- 컬럼명: snake_case
  user_id BIGINT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 인덱스명: idx_테이블명_컬럼명
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);
```

### Oracle
```sql
-- 테이블명: UPPER_SNAKE_CASE (Oracle 전통)
CREATE TABLE USER_PROFILES (
  USER_ID NUMBER(19) PRIMARY KEY,
  CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**📚 상세 가이드**: [SQL Style Guide](https://www.sqlstyle.guide/)

## 🐧 인프라 & DevOps

### Linux/Bash
```bash
#!/bin/bash

# 변수명: snake_case
readonly API_BASE_URL="https://api.example.com"
local user_count=0

# 함수명: snake_case
check_service_status() {
  systemctl is-active "$1" >/dev/null 2>&1
}

# 에러 처리
set -euo pipefail
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# 레이블 사용
LABEL maintainer="team@example.com"
LABEL version="1.0.0"

# 다단계 빌드 활용
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 비root 사용자 사용
USER node
```

### Nginx
```nginx
# nginx.conf - 들여쓰기 2칸
server {
  listen 80;
  server_name example.com;

  # 로그 설정
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log warn;

  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

**📚 상세 가이드**:
- [Bash Style Guide](https://google.github.io/styleguide/shellguide.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🔧 도구 설정

### .editorconfig
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.{java,kt}]
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

### .gitignore 템플릿
```gitignore
# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Dependencies
node_modules/
.pnp/

# Build
dist/
build/
target/

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
logs/
```

## 📚 추가 참고 자료

### 종합 가이드
- [네이버 핵데이 Java 컨벤션](https://naver.github.io/hackday-conventions-java/)
- [Google Style Guides](https://google.github.io/styleguide/)
- [Airbnb Style Guides](https://github.com/airbnb/javascript)

### 기술별 상세 가이드
- **React**: [React Patterns](https://reactpatterns.com/)
- **TypeScript**: [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- **Spring**: [Spring Boot Best Practices](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- **CSS**: [SMACSS](http://smacss.com/), [ITCSS](https://itcss.io/)
- **Database**: [Database Design Rules](https://www.vertabelo.com/blog/naming-conventions-in-database-modeling/)

### 도구
- **Linting**: ESLint, Prettier, Checkstyle, SonarQube
- **Formatting**: EditorConfig, IDE 플러그인
- **Git**: [Conventional Commits](https://www.conventionalcommits.org/)

---

> **참고**: 이 컨벤션은 프로젝트에서 AI 코드 생성 시 필수로 적용되는 규칙입니다.