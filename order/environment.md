# 프로젝트 환경 설정 (Docker 기반)

## 🐳 Docker 환경 우선
모든 서비스가 Docker 컨테이너에서 실행되므로 **로컬 설치가 불필요**합니다.

### 필수 설치 (호스트)
- **Docker**: 24.0+ (Docker Desktop 또는 Docker Engine)
- **Docker Compose**: 2.0+ (또는 docker compose 플러그인)
- **Git**: latest (소스코드 관리용)

### 컨테이너 내부 도구 (자동 설치)
- **Java**: 17+ (eclipse-temurin:17-jre-jammy) ⚠️ openjdk 대신 temurin 사용
- **Spring Boot**: 3.2.0
- **Gradle**: 8.4
- **Node.js**: 18+ (node:18-alpine)
- **React**: 19.1.1 ⚠️ React 19+ 는 import React 불필요
- **TypeScript**: 5.8.3
- **Vite**: 7.1.7
- **MySQL**: 8.0
- **Redis**: 7.0-alpine
- **Nginx**: 1.24-alpine

## 파일 구조
```
project/
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

## 🔧 프로젝트 정보
- **프로젝트명**: itda_ai
- **DB명**: itda
- **DB 사용자**: idolphins2020
- **DB 패스워드**: idolphinspass

## 🌐 포트 매핑 (Host → Container) - Brew 충돌 방지
- **Nginx**: 80:80, 180:180 (80→180 리디렉션, 메인은 180)
- **Frontend**: 15173 → 5173 (React 개발서버)
- **Backend**: 18080 → 8080 (Spring Boot API)
- **MySQL**: 13306 → 3306 (데이터베이스)
- **Redis**: 16379 → 6379 (캐시서버)

## 🔍 환경 확인 명령어

### Docker 설치 확인
```bash
docker --version              # Docker 버전 확인
docker-compose --version      # Docker Compose 버전 확인 (legacy)
docker compose version       # Docker Compose 플러그인 버전 확인 (최신)
```

### 포트 사용 확인 (Docker 전용 포트)
```bash
lsof -i :180                  # Nginx 포트 충돌 확인
lsof -i :15173               # Frontend 포트 충돌 확인
lsof -i :18080                # Backend 포트 충돌 확인
lsof -i :13306                # MySQL 포트 충돌 확인 (brew mysql과 완전 분리)
lsof -i :16379                # Redis 포트 충돌 확인 (brew redis와 완전 분리)
```

### Docker 네트워크 및 볼륨
```bash
docker network ls             # Docker 네트워크 목록
docker volume ls              # Docker 볼륨 목록
docker ps -a                  # 모든 컨테이너 상태 확인
```