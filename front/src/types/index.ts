// API 모드 설정
export type ApiMode = 'mock' | 'real';

// 사용자 정보
export interface UserInfo {
  id: string;
  name: string;
  nickname: string;
  school: string;
  location: string;
  profileImage: string;
  messageCount: number;
  channelInviteCount: number;
  followerCount: number;
  followingCount: number;
}

// 채널 정보
export interface Channel {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
}

// 콘텐츠 아이템
export interface ContentItem {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelId: string;
  type: 'package' | 'contents' | 'question' | 'exam';
  category: string;
  school: string;
  grade: string;
  semester: string;
  subject: string;
  viewCount: number;
  likeCount: number;
  downloadCount: number;
  liked: boolean;
  createdAt: string;
  badges?: string[];
}

// 내 보관함 통계
export interface MyStorage {
  usedSpace: string;
  totalSpace: string;
  packageCount: number;
  contentsCount: number;
  questionCount: number;
  examCount: number;
  sharedCount: number;
  totalCount: number;
}

// 맞춤 과목 정보
export interface CustomSubject {
  schoolLevel: string;
  grade: number;
  subjectId: string;
  subjectName: string;
}
