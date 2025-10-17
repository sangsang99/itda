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
  THUMBNAIL: '/placeholder-thumbnail.jpg',
  CHANNEL_NAME: '내 콘텐츠',
  CHANNEL_ID: 'my-content',
  CONTENT_TYPE: 'contents',
  NO_DATA: '해당없음',
  LIKED: false,
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
