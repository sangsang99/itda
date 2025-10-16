import type { UserInfo } from '../../types';
import './MyBoxSidebar.css';

interface MyBoxSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userInfo: UserInfo | null;
}

export const MyBoxSidebar = ({ activeTab, onTabChange, userInfo }: MyBoxSidebarProps) => {
  const menuItems = [
    { id: 'content-storage', label: '콘텐츠 보관함' },
    { id: 'decoration-storage', label: '꾸미기 보관함' },
    { id: 'munbang-storage', label: '문방 보관함' },
    { id: 'exam-storage', label: '시험지 보관함' },
    { id: 'share-storage', label: '공유 보관함' },
    { id: 'hooiyo-storage', label: '후이요 보관함' },
    { id: 'statistics', label: '내 보관함 통계' },
    { id: 'management', label: '보관함 관리' }
  ];

  return (
    <aside className="mybox-sidebar">
      {/* 프로필 영역 */}
      <div className="sidebar-profile">
        <div className="profile-header">
          <div className="profile-image">
            <img src={userInfo?.profileImage || '/default-avatar.png'} alt="Profile" />
          </div>
          <div className="profile-text">
            <h3 className="profile-name">{userInfo?.name || '온라인테스트 닙'}</h3>
            <div className="profile-follow">
              <span>팔로워 2명</span>
              <span>팔로잉 3명</span>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 공간 정보 */}
      <div className="storage-info">
        <div className="storage-stats">
          <span className="storage-used">132.56MB</span>
          <span className="storage-total">5GB</span>
        </div>
        <div className="storage-bar">
          <div className="storage-progress" style={{ width: '2.6%' }}></div>
        </div>
      </div>

      {/* 메뉴 네비게이션 */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeTab === item.label ? 'active' : ''}`}
            onClick={() => onTabChange(item.label)}
          >
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
