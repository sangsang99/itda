// 콘텐츠 관련 상수 정의

// 학교급 매핑
export const SCHOOL_LEVEL_MAP: Record<string, string> = {
  elementary: '초등학교',
  middle: '중학교',
  high: '고등학교',
};

// 과목명 매핑
export const SUBJECT_MAP: Record<string, string> = {
  korean: '국어',
  math: '수학',
  english: '영어',
  science: '과학',
  social: '사회',
};

// 콘텐츠 타입 매핑
export const CONTENT_TYPE_MAP: Record<string, string> = {
  school: '#교과',
  'non-school': '#비교과',
  element: '#요소자료',
};

// 공개 상태 매핑
export const PUBLIC_STATUS_MAP: Record<string, string> = {
  public: '공개',
  private: '비공개',
};

// 기본값
export const DEFAULT_VALUES = {
  THUMBNAIL: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
  CHANNEL_NAME: '내 콘텐츠',
  CHANNEL_ID: 'my-content',
  CONTENT_TYPE: 'contents',
  NO_DATA: '해당없음',
  LIKED: false,
};

// 카테고리별 Unsplash 썸네일
export const CATEGORY_THUMBNAILS: Record<string, string> = {
  math: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop', // 수학
  korean: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop', // 국어/책
  english: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop', // 영어
  science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', // 과학
  social: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=300&fit=crop', // 사회
  default: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', // 교육 일반
};

// 콘텐츠 형식
export const CONTENT_FORMAT = {
  ATTACHMENT: 'attachment',
  URL: 'url',
  FILE: 'file',
} as const;

// 저작권 타입
export const COPYRIGHT_TYPE = {
  PERSONAL: 'personal',
  SHARED: 'shared',
} as const;

// 이용 조건
export const USAGE_CONDITION = {
  PUBLIC_DOMAIN: 'publicDomain',
  CCL: 'ccl',
  COPYRIGHT: 'copyright',
  OFL: 'ofl',
} as const;

// 저장 타입
export const STORAGE_TYPE = {
  CHANNEL: 'channel',
  STORAGE: 'storage',
} as const;
