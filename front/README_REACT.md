# ITDA React Frontend

잇다(ITDA) 교원 전용 디지털콘텐츠 플랫폼의 React 기반 프론트엔드입니다.

## 프로젝트 구조

```
front/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── Header/         # 헤더 컴포넌트
│   │   ├── UserProfile/    # 사용자 프로필
│   │   ├── MyStorage/      # 내 보관함
│   │   └── ContentList/    # 콘텐츠 리스트
│   ├── pages/              # 페이지 컴포넌트
│   │   └── MainPage/       # 메인 페이지
│   ├── services/           # API 서비스
│   │   ├── apiService.ts   # API 통신 레이어
│   │   └── mockData.ts     # Mock 데이터
│   ├── types/              # TypeScript 타입 정의
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── main.tsx            # 앱 진입점
├── .env                    # 환경 변수 설정
└── package.json            # 프로젝트 의존성
```

## 주요 기능

### 1. API 모드 전환 (Mock / Real)

이 프로젝트는 Mock 데이터와 실제 API를 쉽게 전환할 수 있는 구조로 설계되었습니다.

#### 설정 방법

`.env` 파일에서 API 모드를 설정할 수 있습니다:

```env
# Mock 데이터 사용
VITE_API_MODE=mock

# 실제 백엔드 API 사용
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8080
```

#### 런타임 전환

코드에서도 동적으로 API 모드를 전환할 수 있습니다:

```typescript
import { setApiMode, getApiMode } from './services/apiService';

// 현재 모드 확인
console.log(getApiMode()); // 'mock' 또는 'real'

// 모드 변경
setApiMode('real'); // Mock에서 Real로 전환
setApiMode('mock'); // Real에서 Mock으로 전환
```

### 2. 컴포넌트 구조

#### Header
- 로고, 네비게이션 메뉴
- 통합 검색
- 알림, 프로필 관리

#### UserProfile
- 사용자 정보 표시
- 팔로워/팔로잉 통계
- 쪽지, 채널 초대 알림

#### MyStorage
- 내 보관함 용량 표시
- 콘텐츠 타입별 개수
- 각 항목으로 이동 링크

#### ContentList
- 콘텐츠 그리드 레이아웃
- 좋아요 기능
- 카테고리 필터링
- 썸네일 및 메타정보 표시

### 3. 데이터 흐름

```
Component → API Service → Mock Data / Real API
                ↓
            Response
                ↓
         Component Update
```

## 시작하기

### 개발 서버 실행

```bash
cd front
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/` 디렉토리에 생성됩니다.

### 프리뷰

```bash
npm run preview
```

## 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **React Router** - 라우팅
- **Axios** - HTTP 클라이언트
- **Ant Design** - UI 컴포넌트 라이브러리 (선택적)

## API 서비스 사용 예시

### 사용자 정보 조회

```typescript
import { getUserInfo } from './services/apiService';

const userInfo = await getUserInfo();
console.log(userInfo);
```

### 콘텐츠 목록 조회

```typescript
import { getCustomContents } from './services/apiService';

// 전체 조회
const allContents = await getCustomContents();

// 필터링 조회
const filteredContents = await getCustomContents('package', 'E12_KOR_국어');
```

### 좋아요 토글

```typescript
import { toggleLike } from './services/apiService';

const result = await toggleLike('contentId123', 'contents');
console.log(`새로운 좋아요 수: ${result.likeCount}`);
```

## Mock 데이터 커스터마이징

`src/services/mockData.ts` 파일에서 Mock 데이터를 수정할 수 있습니다:

```typescript
export const mockUserInfo: UserInfo = {
  id: 'user001',
  name: '홍길동',
  nickname: '홍쌤',
  // ... 나머지 필드
};
```

## 실제 API 연동

백엔드 API가 준비되면 다음 단계를 따르세요:

1. `.env` 파일 수정:
   ```env
   VITE_API_MODE=real
   VITE_API_BASE_URL=http://your-backend-url:port
   ```

2. 백엔드 API 엔드포인트가 `src/services/apiService.ts`의 경로와 일치하는지 확인

3. 필요시 API 경로 수정:
   ```typescript
   const response = await apiClient.get<UserInfo>('/api/user/info');
   ```

## 주요 디자인 고려사항

### 재사용성
- 컴포넌트는 props를 통해 설정 가능하도록 설계
- 비즈니스 로직과 UI 분리

### 확장성
- Mock과 Real API를 쉽게 전환 가능
- 새로운 API 추가 시 apiService.ts에만 함수 추가

### 타입 안정성
- 모든 데이터 구조에 TypeScript 타입 정의
- API 응답에 대한 타입 체크

### 성능
- 컴포넌트별 CSS 모듈화
- 필요한 데이터만 로드
- 이미지 에러 핸들링

## 다음 단계

### 추가 구현이 필요한 기능
1. ~~Header 컴포넌트~~ ✅
2. ~~사용자 프로필 섹션~~ ✅
3. ~~내 보관함~~ ✅
4. ~~구독 채널 소식~~ ✅
5. ~~맞춤형 수업자료~~ ✅
6. 베스트 채널 섹션 (TODO)
7. 플로팅 배너/이벤트 (TODO)
8. 상세 페이지 (TODO)
9. 검색 결과 페이지 (TODO)
10. 반응형 디자인 개선 (TODO)

### 백엔드 연동 시 필요한 작업
- 인증/인가 구현 (JWT 등)
- API 에러 핸들링 개선
- 로딩 상태 관리 개선
- 페이지네이션 구현
- 무한 스크롤 구현

## 라이센스

본 프로젝트는 한국교육학술정보원(KERIS) 잇다 플랫폼을 참고하여 작성되었습니다.

## 참고

- 원본 HTML: `itda-main.html`
- 디자인 참고: Ant Design
- API 문서: (백엔드 API 문서 링크 추가 예정)
