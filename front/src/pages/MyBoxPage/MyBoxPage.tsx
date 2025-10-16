import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer';
import { MyBoxSidebar } from '../../components/MyBoxSidebar/MyBoxSidebar';
import { MyBoxContentList } from '../../components/MyBoxContentList/MyBoxContentList';
import { getUserInfo } from '../../services/apiService';
import type { UserInfo, ContentItem } from '../../types';
import './MyBoxPage.css';

export const MyBoxPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('콘텐츠 보관함');
  const [contents, setContents] = useState<ContentItem[]>([]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        return;
      }

      try {
        setLoading(true);
        const mockUser = await getUserInfo();
        setUserInfo(mockUser);

        // Mock 데이터 - 실제로는 API에서 가져와야 합니다
        const mockContents: ContentItem[] = [
          {
            id: '1',
            title: '진진구의 기초 지식, 도형, 단위 연습',
            thumbnail: '/placeholder-thumbnail.jpg',
            channelName: '진진구 수학교실',
            channelId: 'channel1',
            type: 'package',
            category: '#패키지',
            school: '초등학교',
            grade: '5학년',
            semester: '2학기',
            subject: '수학',
            likeCount: 455,
            liked: false,
            createdAt: '2025-05-18',
            badges: ['패키지']
          },
          {
            id: '2',
            title: '진진구의 기초 지식, 도형, 단위 연습',
            thumbnail: '/placeholder-thumbnail.jpg',
            channelName: '진진구 수학교실',
            channelId: 'channel1',
            type: 'package',
            category: '#패키지',
            school: '초등학교',
            grade: '5학년',
            semester: '2학기',
            subject: '수학',
            likeCount: 455,
            liked: false,
            createdAt: '2025-05-18',
            badges: ['패키지']
          },
          {
            id: '3',
            title: '진진구의 기초 지식, 도형, 단위 연습',
            thumbnail: '/placeholder-thumbnail.jpg',
            channelName: '진진구 수학교실',
            channelId: 'channel1',
            type: 'package',
            category: '#패키지',
            school: '초등학교',
            grade: '5학년',
            semester: '2학기',
            subject: '수학',
            likeCount: 455,
            liked: false,
            createdAt: '2025-05-18',
            badges: ['패키지']
          },{
            id: '4',
            title: '진진구의 기초 지식, 도형, 단위 연습',
            thumbnail: '/placeholder-thumbnail.jpg',
            channelName: '진진구 수학교실',
            channelId: 'channel1',
            type: 'package',
            category: '#패키지',
            school: '초등학교',
            grade: '5학년',
            semester: '2학기',
            subject: '수학',
            likeCount: 455,
            liked: false,
            createdAt: '2025-05-18',
            badges: ['패키지']
          }
        ];
        setContents(mockContents);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="mybox-page">
      <Header
        userInfo={
          userInfo
            ? {
                name: userInfo.name,
                profileImage: userInfo.profileImage,
                messageCount: userInfo.messageCount,
              }
            : undefined
        }
      />

      <div className="mybox-header-banner">
        <h1 className="mybox-header-title">내 보관함</h1>
        <p className="mybox-header-subtitle">
          내의 자료 공간! 수업별 자료를 저장하고 관리해보세요. 다른 선생님과 공유할 수 있어요.
        </p>
      </div>

      <main className="mybox-content">
        <div className="mybox-layout">
          <MyBoxSidebar activeTab={activeTab} onTabChange={setActiveTab} userInfo={userInfo} />
          <MyBoxContentList contents={contents} />
        </div>
      </main>

      <Footer />
    </div>
  );
};
