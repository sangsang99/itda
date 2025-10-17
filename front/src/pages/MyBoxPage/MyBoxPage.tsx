import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer';
import { MyBoxSidebar } from '../../components/MyBoxSidebar/MyBoxSidebar';
import { MyBoxContentList } from '../../components/MyBoxContentList/MyBoxContentList';
import { getUserInfo, getUserContents } from '../../services/apiService';
import type { UserInfo, ContentItem } from '../../types';
import './MyBoxPage.css';

export const MyBoxPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
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

  // 콘텐츠 목록 로드 함수
  const loadContents = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const userContents = await getUserContents(user.userId, 0, 20, 'createdAt', 'DESC');
      setContents(userContents);
    } catch (error) {
      console.error('콘텐츠 목록 조회 실패:', error);
      setContents([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        const mockUser = await getUserInfo();
        setUserInfo(mockUser);

        // API에서 콘텐츠 목록 가져오기
        await loadContents();
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

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
          <MyBoxContentList contents={contents} onContentDeleted={loadContents} />
        </div>
      </main>

      <Footer />
    </div>
  );
};
