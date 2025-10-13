
# AI 개발 전략

## 개요

```
Rule: order/ MD Files → AI Analysis → Step-by-Step Project Structure
```

### 핵심 원칙
- **MD 파일 기반**: order/ 폴더의 requirement.md, strategy.md, convention.md, environment.md로 전체 생성
- **독립성**: 각 계층이 완전히 독립적으로 동작 가능
- **단계별 진행**: 컨텍스트 종료에 대비한 체크포인트 기반 개발
- **검증 가능**: curl과 프로세스 명령어로 각 단계 확인

## 사용법(Human)
@order/strategy.md 파일을 토대로 풀스택 프로젝트를 생성해주세요, 단계별로 환경설정을 확인한 뒤 요구사항 생성을 진행하시면 됩니다.

## 파일 정의

| 파일 | 역할 |
|------|------|
| `order/convention.md` | 1. 코딩 컨벤션 및 스타일, 디자인 가이드 : 수정빈도 낮음 |
| `order/environment.md` | 2. 운영체제 환경, 개발도구, 아키텍처 설계, 계정정보 : 이슈시 수정 |
| `order/requirement.md` | 3. 비즈니스 요구사항 + 개발자 요구사항 : 수정시 before-after명시하여 새로운 task로 추가 |
| `order/strategy.md` | 4. AI 관련 요구내용 (트리거) : AI 진행사항 오류 위주 수정 |
| `order/design/*` | 5. 요구사항 디자인 목업 : 해당위치에 파일 있으면 내용 참조/복사 하여 front 진행 |


## AI 프로세스 규칙

### 최초 적용
- `order/requirement.md`, `order/convention.md`, `order/strategy.md`, `order/environment.md` 파일 분석
- 부족하거나 모순되는 정보 사용자 확인 요청
- 체크포인트 기반 단계별 진행 계획 수립
- 생성/실행 전 기존 작업 존재시 삭제

### 항상 적용
- `order/` 폴더 내 MD 파일들 준수
- 한국어 답변
- 파일 생성시 현재 디렉토리 확인(pwd) 및 절대경로 명령
- 프로세스 실행전 현재 사용중인 Port 확인 (`lsof -i :PORT`)

### 각 단계별 적용 (Docker 기반)
- 현재 단계에서 진행할 작업 명시
- Docker 컨테이너 상태 및 API 검증 명령어 제공
- 로컬 환경 충돌 방지 확인 (`lsof -i :PORT`)
- `progress/current-step.md`에 진행상황 기록
- Docker Compose 서비스 의존성 체크

### ⚠️ 주요 이슈 및 해결책
- **Docker 이미지**: `eclipse-temurin:17-jre-jammy` 사용 (openjdk 이미지 불안정)
- **Spring Boot**: JPA 설정은 `ddl-auto: create-drop`로 단순화
- **React 19+**: `import React` 제거 필요 (빌드 오류 방지)
- **Frontend Dockerfile**: `npm ci` 대신 `npm install` 사용
- **Nginx 정적파일**: `/assets/` 경로를 프론트엔드로 프록시 설정 필수

### 파일 구조
```
project_root/
├── web/                # Nginx 정적 파일
├── front/              # React + TypeScript + Vite
├── back/               # Spring Boot + Gradle + Java
├── asset/              # 참고자료
├── bin/                # 실행 스크립트
├── progress/           # ai 작업 진행상황
├── order/              # ai 작업 요구사항
├── docker-compose.yml  # Docker 컨테이너 설정
└── README.md           # 개요
```

## 단계별 개발 순서 (Docker Only)
모든 서비스는 Docker 컨테이너로 실행되며, 로컬 환경 충돌을 방지합니다.

### 🐳 Docker 기반 실행 전략
- **완전 컨테이너화**: 모든 서비스가 Docker 컨테이너에서 실행
- **포트 격리**: 로컬 brew 서비스와 충돌 방지
- **일관성**: 개발/운영 환경 통일
- **의존성 관리**: Docker Compose를 통한 서비스 간 연결

### 단계별 검증 및 실행

1. **DB 생성 (Docker)**
   - 검증: `docker ps --filter 'name=itda-mysql'`
   - MySQL/Redis 컨테이너 실행
   - 스크립트: `bin/db-start.sh`, `bin/db-stop.sh`

2. **Backend 생성 (Docker)**
   - 검증: `curl -f http://localhost:18080/health`
   - Spring Boot 컨테이너 빌드 및 실행
   - 스크립트: `bin/back-start.sh`, `bin/back-stop.sh`

3. **Frontend 생성 (Docker)**
   - 검증: `curl -f http://localhost:15173`
   - React 컨테이너 빌드 및 실행
   - 스크립트: `bin/front-start.sh`, `bin/front-stop.sh`

4. **Nginx 웹서버 (Docker)**
   - 검증: `curl -f http://localhost` (디폴트 포트 리디렉션)
   - 리버스 프록시 및 정적 파일 서빙
   - 스크립트: `bin/web-start.sh`, `bin/web-stop.sh`

5. **통합 실행**
   - 전체 실행: `bin/start-all.sh` (Docker Compose 통합 실행)
   - Docker 전용: `bin/docker-start.sh`, `bin/docker-stop.sh`
   - 개별 중지: `bin/stop-all.sh`

6. **통합 테스트**
   - UI를 통한 로그인/회원가입 기능 제공
   - 사용자가 직접 UI로 확인, Docker DB 직접 확인

### 🔍 환경 확인
- **Docker 필수**: Docker Engine + Docker Compose
- **포트 체크**: 180, 15173, 18080, 13306, 16379 포트 사용 확인 (brew 충돌 방지)
- **로그 모니터링**: `docker-compose logs -f [service]`

## 사용자 확인 요청 시점
영역별 독립성을 벗어나는 시점에 사용자 확인 요청 후 계속 진행:
- Frontend 단독 완료 시
- Backend 단독 완료 시
- DB 단독 완료 시
- 각 영역 간 연결 작업 시작 전
- Web 연결 및 통합 스크립트 완료 시
