import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header/Header';
import Footer from '../../components/Footer';
import { UserProfile } from '../../components/UserProfile/UserProfile';
import {
  getUserInfo,
  getMyStorage,
  getSubscribedChannelNews,
  getCustomContents,
  getCustomSubjects,
  getPopularContents,
} from '../../services/apiService';
import type { UserInfo, MyStorage as MyStorageType, ContentItem, CustomSubject } from '../../types';
import { handleImageError, createDefaultThumbnail } from '../../utils/imageUtils';
import './MainPage.css';

export const MainPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [myStorage, setMyStorage] = useState<MyStorageType | null>(null);
  const [subscribedNews, setSubscribedNews] = useState<ContentItem[]>([]);
  const [customContents, setCustomContents] = useState<ContentItem[]>([]);
  const [customSubjects, setCustomSubjects] = useState<CustomSubject[]>([]);
  const [popularContents, setPopularContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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

        const [mockUser, storage, news, contents, subjects, popular] = await Promise.all([
          getUserInfo(),
          getMyStorage(),
          getSubscribedChannelNews(),
          getCustomContents(),
          getCustomSubjects(),
          getPopularContents(10),
        ]);

        setUserInfo(mockUser);
        setMyStorage(storage);
        setSubscribedNews(news);
        setCustomContents(contents);
        setCustomSubjects(subjects);
        setPopularContents(popular);
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
    <div className="main-page">
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

      <main className="main-content">
        <div className="container">
          {/* 상단 영역 */}
          <div className="top-section">
            {userInfo && <UserProfile userInfo={userInfo} />}

            {/* 내 채널 */}
            <section className="tea-mychannel">
              <div className="tit-area">
                <span>내 채널</span>
                <div className="btn">
                  <a href="#">채널개설</a>
                </div>
              </div>
              <div className="mychannel-content">
                <span className="num">채널이<br />없습니다.</span>
              </div>
            </section>

          </div>

          {/* 인기 콘텐츠 (조회수 높은 순) */}
          {popularContents.length > 0 && (
            <section className="subscribed-news">
              <div className="section-header">
                <h2>🔥 인기 콘텐츠</h2>
                <span className="more-link" style={{fontSize: '14px', color: '#666'}}>
                  조회수 높은 순
                </span>
              </div>
              <div className="news-list">
                {popularContents.map((content) => (
                  <div key={content.id} className="news-card">
                    <div className="news-thumbnail">
                      <img
                        src={content.thumbnail || createDefaultThumbnail(content.title)}
                        alt={content.title}
                        onError={(e) => handleImageError(e, createDefaultThumbnail('썸네일 없음'))}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        👁 {content.viewCount}
                      </div>
                    </div>
                    <div className="news-info">
                      <p className="news-title">{content.title}</p>
                      <p className="news-channel">
                        {content.school} {content.grade} {content.subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 구독 채널 소식 */}
          {subscribedNews.length > 0 && (
            <section className="subscribed-news">
              <div className="section-header">
                <h2>구독 채널 소식</h2>
                <a href="#" className="more-link">
                  더보기 →
                </a>
              </div>
              <div className="news-list">
                {subscribedNews.map((news) => (
                  <div key={news.id} className="news-card">
                    <div className="news-thumbnail">
                      <img
                        src={news.thumbnail || createDefaultThumbnail(news.title)}
                        alt={news.title}
                        onError={(e) => handleImageError(e, createDefaultThumbnail('썸네일 없음'))}
                      />
                    </div>
                    <div className="news-info">
                      <p className="news-title">{news.title}</p>
                      <p className="news-channel">{news.channelName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 맞춤형 수업자료 */}
          <section className="custom-contents-section">
            <div className="section-header-custom">
              <h2 className="section-title">
                <b>{user?.fullName || userInfo?.nickname || '선생님'}</b> 선생님의 맞춤자료
              </h2>
              <div className="section-actions">
                <button
                  type="button"
                  className="button black"
                  onClick={() => alert('맞춤자료 설정')}
                >
                  맞춤자료 설정
                  <img src="/asset2/user/images/main/icon_setting.svg" alt="설정" />
                </button>
                <button
                  type="button"
                  className="button black"
                  onClick={() => alert('맞춤자료 상세보기')}
                >
                  맞춤자료 상세보기
                  <img src="/asset2/user/images/arrow-right.svg" alt="상세보기" />
                </button>
              </div>
            </div>

            {/* 맞춤 과목 탭 */}
            {customSubjects.length > 0 && (
              <div className="subject-tabs">
                <button className="subject-tab active">전체</button>
                {customSubjects.map((subject, index) => (
                  <button key={index} className="subject-tab">
                    {subject.schoolLevel} {subject.grade}학년 {subject.subjectName}
                  </button>
                ))}
              </div>
            )}

          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
