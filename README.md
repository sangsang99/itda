# 🌳 잇다(ITDA) 플랫폼

> **교육의 미래를 잇다** - 교육자들을 위한 통합 교수학습자료 플랫폼

## 📋 프로젝트 개요

잇다(ITDA)는 교원, 학생, 교육기관이 함께 만들어가는 교수학습자료 공유 플랫폼입니다. 교과, 비교과, 요소자료 등 다양한 교육 콘텐츠를 체계적으로 관리하고, 채널 시스템을 통해 양질의 교육 자료를 공유할 수 있습니다.

## 🏗️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx:180     │    │ Frontend:15173  │    │ Backend:18080   │
│   (Web Server)  │◄──►│   (React App)   │◄──►│  (Spring Boot)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Redis:16379   │    │  MySQL:13306    │
                       │    (Cache)      │◄──►│   (Database)    │
                       └─────────────────┘    └─────────────────┘
```

## 🐳 Docker 기반 실행

모든 서비스는 Docker 컨테이너로 실행되어 로컬 환경과의 충돌을 방지하고 일관된 개발/운영 환경을 제공합니다.

### 필수 요구사항

- **Docker**: 24.0+
- **Docker Compose**: 2.0+
- **Git**: latest

### 포트 매핑

| 서비스 | 호스트 포트 | 컨테이너 포트 | 용도 |
|--------|-------------|---------------|------|
| Nginx | 180 | 80 | 메인 웹사이트 |
| Frontend | 15173 | 5173 | React 개발서버 |
| Backend | 18080 | 8080 | Spring Boot API |
| MySQL | 13306 | 3306 | 데이터베이스 |
| Redis | 16379 | 6379 | 캐시서버 |

## 🚀 빠른 시작

### 통합 관리 스크립트 (권장)

```bash
# 전체 시스템 시작
./bin/manage.sh start

# 개별 서비스 시작
./bin/manage.sh start db          # DB만 시작
./bin/manage.sh start backend     # Backend만 시작
./bin/manage.sh start frontend    # Frontend만 시작
./bin/manage.sh start web         # Nginx만 시작
./bin/manage.sh start jenkins     # Jenkins만 시작

# 상태 확인
./bin/manage.sh status

# 로그 확인
./bin/manage.sh logs [service]

# 서비스 중지
./bin/manage.sh stop [service]

# 도움말
./bin/manage.sh help
```

### 기타 유틸리티 스크립트

```bash
# DB만 빠르게 시작 (테스트용)
./bin/quick-start.sh

# Backend API 테스트
./bin/test-backend.sh
```

## 🌐 접속 정보

### 메인 접속 (통합)
- **웹사이트**: http://localhost:180
- **API**: http://localhost:180/api
- **헬스체크**: http://localhost:180/health

### 개별 서비스 접속
- **Frontend**: http://localhost:15173
- **Backend API**: http://localhost:18080/api
- **Backend Health**: http://localhost:18080/api/health
- **MySQL**: localhost:13306 (idolphins2020/idolphinspass)
- **Redis**: localhost:16379
- **Jenkins**: http://localhost:9080

## 🛑 시스템 중지

```bash
# 전체 시스템 중지
./bin/manage.sh stop

# 개별 서비스 중지
./bin/manage.sh stop db
./bin/manage.sh stop backend
./bin/manage.sh stop frontend
./bin/manage.sh stop web
./bin/manage.sh stop jenkins

# 완전 삭제 (컨테이너, 볼륨, 이미지)
./bin/manage.sh clean
```

## 📁 프로젝트 구조

```
itda_ai/
├── web/                # Nginx 웹서버 설정
│   ├── nginx.conf     # Nginx 설정 파일
│   └── static/        # 정적 파일
├── front/             # React Frontend
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트
│   │   ├── hooks/        # 커스텀 훅
│   │   ├── utils/        # 유틸리티 함수
│   │   └── types/        # TypeScript 타입 정의
│   ├── Dockerfile     # Frontend Docker 설정
│   └── package.json   # 의존성 관리
├── back/              # Spring Boot Backend
│   ├── src/main/java/com/itda/
│   │   ├── controller/   # REST API 컨트롤러
│   │   ├── service/      # 비즈니스 로직
│   │   ├── repository/   # 데이터 접근 계층
│   │   ├── entity/       # JPA 엔티티
│   │   └── config/       # 설정 클래스
│   ├── Dockerfile     # Backend Docker 설정
│   └── build.gradle   # Gradle 빌드 설정
├── asset/             # 데이터베이스 스크립트
│   └── sql/
│       ├── 01_init_schema.sql  # 테이블 생성
│       └── 02_sample_data.sql  # 샘플 데이터
├── bin/               # 실행 스크립트
│   ├── manage.sh          # 통합 관리 스크립트 (권장)
│   ├── quick-start.sh     # DB 빠른 시작 (테스트용)
│   └── test-backend.sh    # Backend API 테스트
├── progress/          # AI 작업 진행상황
├── order/             # AI 작업 요구사항
├── docker-compose.yml # Docker Compose 설정
├── .gitignore         # Git 제외 파일 (루트)
└── README.md          # 프로젝트 문서
```

## 📦 Git 관리

### .gitignore 구조

프로젝트는 멀티 프로젝트 구조에 맞게 계층적 .gitignore를 사용합니다:

```
루트 .gitignore           # 공통 제외 항목 (macOS, IDE, Docker 등)
├── back/.gitignore       # Java/Gradle 관련 (.gradle, build, *.class)
├── front/.gitignore      # Node.js/React 관련 (node_modules, dist)
└── web/.gitignore        # Nginx 관련 (로그, 캐시)
```

### 주요 제외 항목

**공통**
- `.DS_Store`, `.vscode/`, `.idea/` (IDE 설정)
- `.env`, `.env.local` (환경변수, `.env.example`만 추적)
- `*.log`, `logs/` (로그 파일)
- Docker 볼륨 데이터 (`mysql-data/`, `redis-data/`, `jenkins_home/`)

**Backend (Java/Spring Boot)**
- `.gradle/`, `build/` (빌드 산출물)
- `*.class`, `*.jar` (컴파일된 파일)
- `application-local.yml` (로컬 설정)

**Frontend (React/Node.js)**
- `node_modules/` (의존성)
- `dist/`, `build/` (빌드 결과)
- `.vite/` (Vite 캐시)

### Git 사용 팁

```bash
# 현재 추적되는 파일 확인
git status

# .gitignore 적용 전 이미 추적된 파일 제거
git rm -r --cached 파일명

# 무시된 파일도 포함하여 확인
git status --ignored
```

## 🔧 개발 가이드

### 기술 스택

**Frontend**
- React 19.1.1 + TypeScript 5.8.3
- Vite 7.1.7 (개발 서버)
- Ant Design 5.12.5 (UI 컴포넌트)
- Styled Components 6.1.6
- React Query (상태 관리)

**Backend**
- Spring Boot 3.2.0 + Java 17
- Spring Security (인증/보안)
- Spring Data JPA (데이터 접근)
- MySQL 8.0 (메인 데이터베이스)
- Redis 7.0 (캐시/세션)

**Infrastructure**
- Docker & Docker Compose
- Nginx 1.24 (리버스 프록시)

### 개발 환경 설정

1. **환경 확인**
   ```bash
   docker --version
   docker compose version
   ```

2. **포트 충돌 확인**
   ```bash
   lsof -i :180,15173,18080,13306,16379
   ```

3. **개발 모드 실행**
   ```bash
   # DB만 시작하고 Frontend/Backend는 로컬에서 개발
   ./bin/db-start.sh
   cd front && npm run dev     # Frontend 개발 서버
   cd back && ./gradlew bootRun # Backend 개발 서버
   ```

## 📊 모니터링

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker ps --filter 'name=itda-'

# 전체 서비스 상태
docker-compose ps

# 로그 확인
docker-compose logs -f              # 전체 로그
docker-compose logs -f itda-backend # 특정 서비스 로그
```

### 헬스 체크

```bash
# 각 서비스 상태 확인
curl http://localhost:180/health          # Nginx
curl http://localhost:15173              # Frontend
curl http://localhost:18080/api/health   # Backend
docker exec itda-mysql mysqladmin ping  # MySQL
docker exec itda-redis redis-cli ping   # Redis
```

## 🎯 주요 기능

### 사용자 관리
- 에듀넷 SSO 통합 인증
- 교원/학생/관리자 권한 관리
- 프로필 및 활동 이력 관리

### 채널 시스템
- 교원채널, 올해의 채널, 꾸러미제작단, 기관채널
- 채널 구독 및 알림
- 채널별 콘텐츠 관리

### 콘텐츠 관리
- 교과/비교과/요소자료 분류
- 파일 업로드 및 URL 연결
- 일괄 등록 및 관리

### 꾸러미 제작
- 여러 콘텐츠를 모은 수업안 제작
- 교육과정 연계 구성
- 공유 및 평가

### 검색 및 추천
- 통합 검색 (콘텐츠, 채널, 사용자)
- 개인화 추천 시스템
- 인기 및 최신 콘텐츠

## 🐛 문제 해결

### 빠른 해결 방법

**처음 실행 시 문제가 발생하면:**
```bash
# 1. 빠른 테스트 (DB만)
./bin/quick-start.sh

# 2. 전체 정리 후 재시작
./bin/stop-all.sh
docker system prune -f
./bin/start-all.sh
```

### 일반적인 문제

**포트 충돌 오류**
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :포트번호
kill -9 PID  # 프로세스 강제 종료
```

**Docker 빌드 오류**
```bash
# 이미지 캐시 삭제 후 재빌드
docker-compose build --no-cache
docker-compose up -d

# 또는 개별 서비스 재빌드
docker-compose build --no-cache itda-backend
docker-compose up -d itda-backend
```

**Backend 빌드 시간이 오래 걸리는 경우**
```bash
# Gradle 캐시 및 의존성 다운로드 시간이 걸림 (첫 실행)
# 빌드 진행상황 확인:
docker logs -f itda-backend
```

**데이터베이스 연결 오류**
```bash
# MySQL 컨테이너 로그 확인
docker logs itda-mysql

# 수동 접속 테스트
docker exec -it itda-mysql mysql -u idolphins2020 -p itda
```

**컨테이너가 시작되지 않는 경우**
```bash
# 모든 컨테이너 상태 확인
docker ps -a

# 실패한 컨테이너 로그 확인
docker logs 컨테이너명

# 전체 재설정
docker-compose down -v
docker system prune -f
./bin/start-all.sh
```

### 로그 위치

- **Nginx**: `docker logs itda-web`
- **Frontend**: `docker logs itda-frontend`
- **Backend**: `docker logs itda-backend`
- **MySQL**: `docker logs itda-mysql`
- **Redis**: `docker logs itda-redis`

## 📞 지원

- **GitHub Issues**: [프로젝트 저장소]
- **개발 문서**: `/order/` 폴더 내 상세 문서
- **API 문서**: http://localhost:18080/swagger-ui.html

## 📝 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

---

**잇다(ITDA) 플랫폼** - 교육의 미래를 잇다 🌳

*이 README는 AI에 의해 생성되었으며, 프로젝트 구조와 실행 방법을 설명합니다.*