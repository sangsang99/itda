# 빠른 시작 가이드

## 1. 개발 환경 설정

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn
- Docker & Docker Compose (프로덕션 배포용)

### 로컬 개발 실행

```bash
cd front
npm install
npm run dev
```

브라우저에서 http://localhost:15173 접속

### Docker로 실행

프로젝트 루트에서:

```bash
# 전체 스택 실행 (MySQL, Redis, Backend, Frontend)
docker-compose up -d

# Frontend만 재빌드
docker-compose up -d --build itda-frontend

# 로그 확인
docker-compose logs -f itda-frontend
```

브라우저에서 http://localhost:15173 접속

## 2. API 모드 설정

### Mock 데이터 사용 (기본값)
`.env` 파일:
```env
VITE_API_MODE=mock
```

이 모드에서는 `src/services/mockData.ts`의 데이터를 사용합니다.

### 실제 백엔드 연동
`.env` 파일:
```env
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:18080
```

Docker 환경에서는 자동으로 `http://itda-backend:8080`으로 연결됩니다.

## 3. 포트 정보

- **Frontend (개발)**: 15173
- **Frontend (Docker)**: 15173
- **Backend**: 18080
- **MySQL**: 13306
- **Redis**: 16379
- **Nginx**: 80, 180

## 4. 구현된 기능

### ✅ 완료
- Header (로고, 메뉴, 검색, 알림, 프로필)
- 사용자 프로필 섹션
- 내 보관함
- 구독 채널 소식
- 맞춤형 수업자료
- 콘텐츠 좋아요 기능
- Mock/Real API 전환 시스템

### 📝 추가 구현 필요
- 베스트 채널 섹션
- 플로팅 배너/이벤트
- 콘텐츠 상세 페이지
- 검색 결과 페이지
- 무한 스크롤/페이지네이션

## 5. 디렉토리 구조

```
src/
├── components/       # 재사용 컴포넌트
│   ├── Header/
│   ├── UserProfile/
│   ├── MyStorage/
│   └── ContentList/
├── pages/           # 페이지 컴포넌트
│   └── MainPage/
├── services/        # API 서비스
│   ├── apiService.ts
│   └── mockData.ts
└── types/           # 타입 정의
    └── index.ts
```

## 6. Mock 데이터 수정

`src/services/mockData.ts` 파일을 수정하여 테스트 데이터를 변경할 수 있습니다.

```typescript
export const mockUserInfo: UserInfo = {
  id: 'user001',
  name: '홍길동',  // 여기를 수정
  // ...
};
```

## 7. 새로운 API 추가

1. `src/types/index.ts`에 타입 정의 추가
2. `src/services/mockData.ts`에 Mock 데이터 추가
3. `src/services/apiService.ts`에 API 함수 추가

예시:
```typescript
// 1. 타입 정의
export interface NewData {
  id: string;
  name: string;
}

// 2. Mock 데이터
export const mockNewData: NewData[] = [
  { id: '1', name: 'Test' }
];

// 3. API 함수
export const getNewData = async (): Promise<NewData[]> => {
  if (apiMode === 'mock') {
    return mockDelay(mockNewData);
  }
  const response = await apiClient.get<NewData[]>('/api/new-data');
  return response.data;
};
```

## 8. 스타일 수정

각 컴포넌트는 독립적인 CSS 파일을 가지고 있습니다.
- `Header.css`
- `UserProfile.css`
- `MyStorage.css`
- `ContentList.css`
- `MainPage.css`

## 9. 빌드 및 배포

### 로컬 빌드
```bash
npm run build
npm run preview
```

### Docker 빌드
```bash
# Frontend 이미지만 빌드
docker-compose build itda-frontend

# 전체 스택 빌드 및 실행
docker-compose up -d --build
```

### 프로덕션 배포
```bash
# 모든 서비스 시작
docker-compose up -d

# 특정 서비스만 재시작
docker-compose restart itda-frontend

# 서비스 중지
docker-compose down

# 볼륨까지 삭제
docker-compose down -v
```

## 10. Docker 명령어

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f itda-frontend

# 컨테이너 접속
docker-compose exec itda-frontend sh

# 리소스 사용량 확인
docker stats itda-frontend

# 네트워크 확인
docker network ls
docker network inspect output_sample_itda-network
```

## 11. 문제 해결

### 포트 충돌
다른 포트 사용 시 `vite.config.ts` 및 `docker-compose.yml` 수정

### API 연결 오류
1. `.env` 파일의 `VITE_API_BASE_URL` 확인
2. 백엔드 서버 실행 상태 확인
   ```bash
   docker-compose ps itda-backend
   docker-compose logs itda-backend
   ```
3. CORS 설정 확인

### Docker 빌드 실패
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache itda-frontend

# 이미지 삭제 후 재빌드
docker-compose down
docker rmi output_sample_itda-frontend
docker-compose up -d --build
```

### 타입 오류
```bash
# TypeScript 타입 체크
npm run build
```

## 12. 참고 자료

- React 공식 문서: https://react.dev
- Vite 공식 문서: https://vitejs.dev
- TypeScript 공식 문서: https://www.typescriptlang.org
- Docker 공식 문서: https://docs.docker.com
- 프로젝트 상세 문서: `README_REACT.md`
