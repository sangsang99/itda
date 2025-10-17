import axios from 'axios';
import type { UserInfo, Channel, ContentItem, MyStorage, CustomSubject, ApiMode } from '../types';
import {
  mockUserInfo,
  mockMyStorage,
  mockMyChannels,
  mockSubscribedChannelNews,
  mockCustomContents,
  mockCustomSubjects,
} from './mockData';
import {
  SCHOOL_LEVEL_MAP,
  SUBJECT_MAP,
  CONTENT_TYPE_MAP,
  PUBLIC_STATUS_MAP,
  DEFAULT_VALUES,
  CATEGORY_THUMBNAILS,
} from '../constants/contentConstants';

// API 모드 설정 (환경 변수로 제어 가능)
let apiMode: ApiMode = (import.meta.env.VITE_API_MODE as ApiMode) || 'mock';

// API 모드 변경 함수
export const setApiMode = (mode: ApiMode) => {
  apiMode = mode;
  console.log(`API 모드가 ${mode}로 변경되었습니다.`);
};

// 현재 API 모드 확인
export const getApiMode = (): ApiMode => apiMode;

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock 응답 시뮬레이션 (네트워크 지연 효과)
const mockDelay = <T>(data: T, delay = 300): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo> => {
  if (apiMode === 'mock') {
    return mockDelay(mockUserInfo);
  }

  const response = await apiClient.get<UserInfo>('/api/user/info');
  return response.data;
};

// 내 보관함 정보 조회
export const getMyStorage = async (): Promise<MyStorage> => {
  if (apiMode === 'mock') {
    return mockDelay(mockMyStorage);
  }

  const response = await apiClient.get<MyStorage>('/api/user/storage');
  return response.data;
};

// 내 채널 목록 조회
export const getMyChannels = async (): Promise<Channel[]> => {
  if (apiMode === 'mock') {
    return mockDelay(mockMyChannels);
  }

  const response = await apiClient.get<Channel[]>('/api/user/channels');
  return response.data;
};

// 구독 채널 소식 조회
export const getSubscribedChannelNews = async (): Promise<ContentItem[]> => {
  if (apiMode === 'mock') {
    return mockDelay(mockSubscribedChannelNews);
  }

  const response = await apiClient.get<ContentItem[]>('/api/channels/subscribed/news');
  return response.data;
};

// 맞춤형 수업자료 조회
export const getCustomContents = async (
  category?: string,
  subject?: string
): Promise<ContentItem[]> => {
  if (apiMode === 'mock') {
    let filtered = [...mockCustomContents];

    if (subject && subject !== 'all') {
      const [schoolLevel, grade, , subjectName] = subject.split('_');
      filtered = filtered.filter(
        (item) =>
          item.school === schoolLevel &&
          item.grade === grade &&
          item.subject === subjectName
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter((item) => item.type === category);
    }

    return mockDelay(filtered);
  }

  const response = await apiClient.get<ContentItem[]>('/api/contents/custom', {
    params: { category, subject },
  });
  return response.data;
};

// 맞춤 과목 목록 조회
export const getCustomSubjects = async (): Promise<CustomSubject[]> => {
  if (apiMode === 'mock') {
    return mockDelay(mockCustomSubjects);
  }

  const response = await apiClient.get<CustomSubject[]>('/api/user/custom-subjects');
  return response.data;
};

// 좋아요 토글
export const toggleLike = async (
  contentId: string,
  contentType: 'package' | 'contents'
): Promise<{ success: boolean; likeCount: number }> => {
  if (apiMode === 'mock') {
    // Mock에서는 현재 상태를 찾아서 토글
    const allContents = [...mockCustomContents, ...mockSubscribedChannelNews];
    const content = allContents.find((item) => item.id === contentId);

    if (content) {
      const newLiked = !content.liked;
      const newLikeCount = newLiked ? content.likeCount + 1 : content.likeCount - 1;
      content.liked = newLiked;
      content.likeCount = newLikeCount;

      return mockDelay({ success: true, likeCount: newLikeCount });
    }

    return mockDelay({ success: false, likeCount: 0 });
  }

  const endpoint = contentType === 'package' ? '/viewer/insertJoin.json' : '/cts/act/respns/insert.json';
  const response = await apiClient.post<{ success: boolean; likeCount: number }>(endpoint, {
    id: contentId,
    contentType,
  });
  return response.data;
};

// 콘텐츠 상세 조회
export const getContentDetail = async (contentId: string): Promise<ContentItem | null> => {
  if (apiMode === 'mock') {
    const allContents = [...mockCustomContents, ...mockSubscribedChannelNews];
    const content = allContents.find((item) => item.id === contentId);
    return mockDelay(content || null);
  }

  const response = await apiClient.get<ContentItem>(`/api/contents/${contentId}`);
  return response.data;
};

// 백엔드 ContentResponse 타입
interface BackendContentResponse {
  contentId: number;
  title: string;
  description: string;
  contentType: string;
  schoolLevel: string;
  grade: string;
  semester: string;
  subject: string;
  achievementStandard: string;
  contentFormat: string;
  contentUrl: string;
  fileName: string;
  fileSize: number;
  fileExtension: string;
  parentContentId: number | null;
  isSupportMaterial: boolean;
  thumbnailPath: string | null;
  keywords: string;
  copyrightType: string;
  usageCondition: string;
  publicStatus: string;
  storageType: string;
  channelId: number | null;
  folderPath: string | null;
  userId: number;
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// 백엔드 응답을 프론트엔드 ContentItem으로 변환
const convertBackendContentToContentItem = (backendContent: BackendContentResponse): ContentItem => {
  // 썸네일 결정: thumbnailPath가 있으면 사용, 없으면 과목에 맞는 Unsplash 이미지
  const getThumbnail = () => {
    if (backendContent.thumbnailPath) {
      return backendContent.thumbnailPath;
    }
    // 과목별 썸네일 선택
    const subject = backendContent.subject?.toLowerCase();
    return CATEGORY_THUMBNAILS[subject] || CATEGORY_THUMBNAILS.default;
  };

  return {
    id: String(backendContent.contentId),
    title: backendContent.title,
    thumbnail: getThumbnail(),
    channelName: DEFAULT_VALUES.CHANNEL_NAME, // API에 없는 필드 - 기본값
    channelId: backendContent.channelId ? String(backendContent.channelId) : DEFAULT_VALUES.CHANNEL_ID,
    type: DEFAULT_VALUES.CONTENT_TYPE as 'package' | 'contents' | 'question' | 'exam', // API에 없는 필드 - 기본값
    category: CONTENT_TYPE_MAP[backendContent.contentType] || DEFAULT_VALUES.NO_DATA,
    school: SCHOOL_LEVEL_MAP[backendContent.schoolLevel] || backendContent.schoolLevel || DEFAULT_VALUES.NO_DATA,
    grade: backendContent.grade ? `${backendContent.grade}학년` : DEFAULT_VALUES.NO_DATA,
    semester: backendContent.semester ? `${backendContent.semester}학기` : DEFAULT_VALUES.NO_DATA,
    subject: SUBJECT_MAP[backendContent.subject] || backendContent.subject || DEFAULT_VALUES.NO_DATA,
    viewCount: backendContent.viewCount || 0,
    likeCount: backendContent.likeCount || 0,
    downloadCount: backendContent.downloadCount || 0,
    liked: DEFAULT_VALUES.LIKED, // API에 없는 필드 - 기본값
    createdAt: backendContent.createdAt ? backendContent.createdAt.split('T')[0] : '',
    badges: [PUBLIC_STATUS_MAP[backendContent.publicStatus] || DEFAULT_VALUES.NO_DATA],
  };
};

// 사용자 콘텐츠 목록 조회 (페이지네이션)
export const getUserContents = async (
  userId: number,
  page: number = 0,
  size: number = 20,
  sortBy: string = 'createdAt',
  direction: string = 'DESC'
): Promise<ContentItem[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:18080/api';

  try {
    const response = await fetch(
      `${API_BASE_URL}/contents/user/${userId}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`콘텐츠 목록 조회 실패: ${response.statusText}`);
    }

    const data = await response.json();

    // Spring의 Page 응답에서 content 배열 추출
    const contents: BackendContentResponse[] = data.content || [];

    // 백엔드 응답을 프론트엔드 형식으로 변환
    return contents.map(convertBackendContentToContentItem);
  } catch (error) {
    console.error('콘텐츠 목록 조회 오류:', error);
    throw error;
  }
};
