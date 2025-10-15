import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';
import { handleImageError, DEFAULT_PROFILE_SVG } from '../../utils/imageUtils';

interface HeaderProps {
  userInfo?: {
    name: string;
    profileImage: string;
    messageCount: number;
  };
}

export const Header = ({ userInfo: propsUserInfo }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // AuthContext의 user가 있으면 우선 사용, 없으면 props의 userInfo 사용
  const userInfo = user ? {
    name: user.fullName,
    profileImage: DEFAULT_PROFILE_SVG, // 실제 프로필 이미지가 있다면 user.profileImage 사용
    messageCount: 0, // 실제 메시지 카운트가 있다면 해당 값 사용
  } : propsUserInfo;

  const menuItems = [
    {
      title: '채널서비스',
      items: [
        { name: '교원채널', link: '#' },
        { name: '올해의 채널', link: '#' },
        { name: '꾸러미제작단', link: '#' },
        { name: '기관 채널', link: '#' },
      ],
    },
    {
      title: '교수학습자료',
      items: [
        { name: '교과', link: '#' },
        { name: '비교과', link: '#' },
        { name: '요소자료', link: '#' },
      ],
    },
    {
      title: '내자료등록',
      items: [
        { name: '콘텐츠 등록', link: '/content/register', internal: true },
        { name: '콘텐츠 일괄등록', link: '#' },
        { name: '꾸러미 등록', link: '#' },
        { name: '문항 등록', link: '#' },
        { name: '시험지 등록', link: '#' },
      ],
    },
    {
      title: '안내',
      items: [
        { name: '잇다란?', link: '#' },
        { name: '공지사항', link: '#' },
        { name: '자주하는 질문', link: '#' },
        { name: '매뉴얼', link: 'https://itda.edunet.net/asset2/user/guide/ITDA_Intruduce_Ver.1.3.pdf', external: true },
      ],
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      window.location.href = `/search.do?searchKeyword=${encodeURIComponent(searchKeyword)}`;
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <div className="header-logo">
            <Link to="/" title="잇다(ITDA) 서비스">
              <span className="logo-text">ITDA</span>
            </Link>
            <p>
              교원 전용<br />
              <b className="digital">디지털콘텐츠</b><br />
              <b className="platform">플랫폼</b>
            </p>
          </div>

          <nav className="header-menu">
            <ul className="header-content">
              {menuItems.map((menu) => (
                <li key={menu.title}>{menu.title}</li>
              ))}
            </ul>

            <div className="header-content-wrap">
              <div className="logo-box">
                <div className="logo-des">
                  <span>선생님의</span>
                  <span>선생님에 의한</span>
                  <span>선생님을 위한 플랫폼</span>
                </div>
              </div>

              <div className="menu-wrap">
                {menuItems.map((menu, index) => (
                  <div key={index} className="menu-group">
                    {menu.items.map((item: any) => (
                      item.external ? (
                        <a
                          key={item.name}
                          className="menu-button"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </a>
                      ) : item.internal ? (
                        <Link
                          key={item.name}
                          className="menu-button"
                          to={item.link}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a key={item.name} className="menu-button" href={item.link}>
                          {item.name}
                        </a>
                      )
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* 검색 영역 */}
        <div className="search-area">
          <form onSubmit={handleSearch} className="srch-bar">
            <label htmlFor="totSrch">통합검색</label>
            <input
              type="text"
              id="totSrch"
              className="total-search"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              autoComplete="off"
            />
            {searchKeyword && (
              <button
                type="button"
                className="del-keyword"
                onClick={() => setSearchKeyword('')}
              >
                <span>키워드 삭제</span>
              </button>
            )}
            <button type="submit" className="btn-search" title="검색">
              <span>검색</span>
            </button>
          </form>
        </div>

        {/* 오른쪽 영역 */}
        <div className="header-right">
          <div className="my-info">
            <button
              type="button"
              className="btn-alim"
              title="알림"
              onClick={() => setShowNotification(!showNotification)}
            >
              <span>알림</span>
              {userInfo && userInfo.messageCount > 0 && (
                <i className="badge">{userInfo.messageCount}</i>
              )}
            </button>

            {showNotification && (
              <div className="alim-wrap">
                <div className="alim-header">
                  <div className="alim-header-title">알림</div>
                </div>
                <div className="alim-cont">
                  <ul>
                    <li className="nothing">
                      <p>알림이 없습니다.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <img
              src={userInfo?.profileImage || DEFAULT_PROFILE_SVG}
              className="btn-profile"
              title="내 프로필"
              alt="내 프로필"
              onClick={() => setShowProfile(!showProfile)}
              onError={(e) => handleImageError(e, DEFAULT_PROFILE_SVG)}
              style={{ cursor: 'pointer' }}
            />

            {showProfile && (
              <div className="my-profile">
                <h3>{userInfo?.name || '사용자'} 선생님</h3>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>프로필 관리</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>쪽지함</a></li>
                  <hr className="profile-hr" />
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>내 보관함</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>채널 개설 페이지</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>채널 신청현황</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>내가 올린 자료 이용현황</a></li>
                  <hr className="profile-hr" />
                  <li><a href="https://ncs.edunet.net/ncs/main/521" target="_blank" rel="noopener noreferrer">문의 및 신고하기</a></li>
                  <hr className="profile-hr" />
                  {isAuthenticated ? (
                    <li>
                      <a href="#" onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await logout();
                          setShowProfile(false);
                          navigate('/login');
                        } catch (error) {
                          console.error('로그아웃 실패:', error);
                          alert('로그아웃에 실패했습니다.');
                        }
                      }}>로그아웃</a>
                    </li>
                  ) : (
                    <li><Link to="/login" onClick={() => setShowProfile(false)}>로그인</Link></li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
