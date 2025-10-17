# 콘텐츠 API 연동 가이드

## 개요

콘텐츠 등록 후 MyBoxContentList에서 백엔드 API를 통해 실제 데이터를 표시하도록 구현되었습니다.

## 주요 변경 사항

### 1. API 서비스 함수 추가
**파일**: `front/src/services/apiService.ts:226-286`

- `getUserContents(userId, page, size, sortBy, direction)`: 사용자의 콘텐츠 목록 조회
- `convertBackendContentToContentItem()`: 백엔드 응답을 프론트엔드 형식으로 변환
- 백엔드 엔드포인트: `GET /api/contents/user/{userId}`

### 2. 상수 파일 생성
**파일**: `front/src/constants/contentConstants.ts`

API 응답에 없는 값들을 상수로 정의:
- `SCHOOL_LEVEL_MAP`: 학교급 매핑 (elementary → 초등학교)
- `SUBJECT_MAP`: 과목명 매핑 (math → 수학)
- `CONTENT_TYPE_MAP`: 콘텐츠 타입 매핑
- `PUBLIC_STATUS_MAP`: 공개 상태 매핑
- `DEFAULT_VALUES`: 기본값 (썸네일, 채널명 등)

### 3. MyBoxPage 수정
**파일**: `front/src/pages/MyBoxPage/MyBoxPage.tsx:14-55`

- AuthContext에서 `user` 정보를 가져와 실제 로그인한 사용자 ID 사용
- `getUserContents(user.userId, ...)`로 해당 사용자의 콘텐츠 목록 조회
- Mock 데이터 대신 실제 API 호출

### 4. 샘플 데이터 SQL
**파일**: `asset/sql/04_sample_content_data.sql`

8개의 샘플 콘텐츠 데이터:
- user_id = 2 (teacher01 - 김선생): 5개 콘텐츠
- user_id = 3 (teacher02 - 이선생): 3개 콘텐츠

## 데이터 변환 매핑

| 프론트엔드 필드 | 백엔드 필드 | 기본값/변환 |
|----------------|------------|------------|
| `id` | `contentId` | String 변환 |
| `thumbnail` | `thumbnailPath` | `/placeholder-thumbnail.jpg` (없을 경우) |
| `channelName` | - | `'내 콘텐츠'` |
| `channelId` | `channelId` | `'my-content'` (없을 경우) |
| `type` | - | `'contents'` |
| `category` | `contentType` | CONTENT_TYPE_MAP 사용 |
| `school` | `schoolLevel` | SCHOOL_LEVEL_MAP 사용 |
| `grade` | `grade` | `{grade}학년` 형식 |
| `semester` | `semester` | `{semester}학기` 형식 |
| `subject` | `subject` | SUBJECT_MAP 사용 |
| `liked` | - | `false` |
| `badges` | `publicStatus` | PUBLIC_STATUS_MAP 사용 |

## 사용 방법

### 1. 데이터베이스 샘플 데이터 추가

```bash
# MySQL에 접속하여 실행
mysql -u root -p itda < asset/sql/04_sample_content_data.sql
```

### 2. 로그인 계정 정보

다음 계정으로 로그인하여 테스트할 수 있습니다:

| 사용자명 | 비밀번호 | 이름 | 타입 | 샘플 콘텐츠 수 |
|---------|---------|------|------|--------------|
| `teacher01` | `password123` | 김선생 | 교사 | 5개 |
| `teacher02` | `password123` | 이선생 | 교사 | 3개 |
| `admin` | `password123` | 관리자 | 관리자 | 0개 |

### 3. 프론트엔드 실행

```bash
cd front
npm install
npm run dev
```

### 4. 테스트 절차

1. 브라우저에서 `http://localhost:5173` 접속
2. `teacher01` / `password123` 로 로그인
3. `/mybox` 페이지 이동
4. 5개의 샘플 콘텐츠가 표시되는지 확인
5. `/content-registration` 페이지에서 새 콘텐츠 등록
6. `/mybox` 페이지 새로고침 후 새 콘텐츠 확인

## API 엔드포인트

### 사용자 콘텐츠 목록 조회

```
GET /api/contents/user/{userId}?page=0&size=20&sortBy=createdAt&direction=DESC
```

**Parameters:**
- `userId` (path): 사용자 ID
- `page` (query): 페이지 번호 (기본값: 0)
- `size` (query): 페이지 크기 (기본값: 20)
- `sortBy` (query): 정렬 기준 (기본값: createdAt)
- `direction` (query): 정렬 방향 (기본값: DESC)

**Response:**
```json
{
  "content": [
    {
      "contentId": 1,
      "title": "초등 3학년 수학 - 분수의 이해",
      "description": "분수의 기본 개념을 이해하고...",
      "contentType": "school",
      "schoolLevel": "elementary",
      "grade": "3",
      "semester": "1",
      "subject": "math",
      "achievementStandard": "[4수01-11] 분수의 의미를...",
      "contentFormat": "attachment",
      "thumbnailPath": null,
      "keywords": "수학,분수,초등수학,교육자료",
      "copyrightType": "personal",
      "usageCondition": "publicDomain",
      "publicStatus": "public",
      "storageType": "storage",
      "channelId": null,
      "folderPath": null,
      "userId": 2,
      "viewCount": 128,
      "likeCount": 15,
      "downloadCount": 8,
      "createdAt": "2025-10-17T12:00:00",
      "updatedAt": "2025-10-17T12:00:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 5,
  "totalPages": 1
}
```

## 주의사항

1. **인증 토큰**: API 호출 시 localStorage에서 JWT 토큰을 가져와 Authorization 헤더에 포함합니다.
2. **사용자 ID**: AuthContext의 `user.userId`를 사용하여 로그인한 사용자의 콘텐츠만 조회합니다.
3. **페이지네이션**: 기본값으로 최신순 20개의 콘텐츠를 가져옵니다.
4. **에러 처리**: 콘텐츠 조회 실패 시 빈 배열을 표시합니다.

## 콘텐츠 등록 후 확인

ContentRegistrationPage에서 콘텐츠 등록 후:
1. 성공 메시지가 표시됩니다
2. 자동으로 메인 페이지로 이동합니다
3. `/mybox` 페이지에서 새로고침하면 새로 등록된 콘텐츠가 표시됩니다

## 샘플 콘텐츠 데이터 상세

### teacher01 (user_id=2) 콘텐츠
1. 초등 3학년 수학 - 분수의 이해
2. 초등학교 국어 - 동시 감상
3. 창의력 향상 프로그램
4. 학급 운영 가이드 (비공개)
5. 수학 문제 해결 전략

### teacher02 (user_id=3) 콘텐츠
1. 중학교 영어 - 기본 문법 정리
2. 고등학교 과학 - 화학 반응식
3. 중학교 사회 - 세계 지리 탐험

## 트러블슈팅

### 콘텐츠가 표시되지 않는 경우
1. 백엔드 서버가 실행 중인지 확인
2. 데이터베이스에 샘플 데이터가 있는지 확인
3. 올바른 계정으로 로그인했는지 확인
4. 브라우저 콘솔에서 API 에러 확인

### 인증 에러가 발생하는 경우
1. localStorage에 토큰이 있는지 확인
2. 토큰이 만료되지 않았는지 확인
3. 다시 로그인 시도

### 데이터 형식 오류
1. 백엔드 ContentResponse와 프론트엔드 변환 함수가 일치하는지 확인
2. 상수 파일의 매핑이 올바른지 확인
