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
