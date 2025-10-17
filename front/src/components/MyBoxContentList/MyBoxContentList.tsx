import { useState } from 'react';
import type { ContentItem } from '../../types';
import './MyBoxContentList.css';

interface MyBoxContentListProps {
  contents: ContentItem[];
}

export const MyBoxContentList = ({ contents }: MyBoxContentListProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="mybox-content-list">
      {/* 상단 인포 박스 */}
      <div className="info-box">
        <h2 className="info-title">콘텐츠 보관함</h2>
        <p className="info-description">내가 만든 콘텐츠와 내가 담은 콘텐츠를 모아둔 보관함입니다.</p>
      </div>

      {/* 툴바 */}
      <div className="content-toolbar">
        <button className="toolbar-btn">
          <span className="btn-icon">📁</span>
          <span className="btn-text">폴더보기</span>
        </button>
        <button className="toolbar-btn">
          <span className="btn-icon">📊</span>
          <span className="btn-text">폴더별정렬</span>
        </button>
        <button className="toolbar-btn primary">
          <span className="btn-icon">✏️</span>
          <span className="btn-text">콘텐츠 관리</span>
        </button>
        <button className="toolbar-btn primary">
          <span className="btn-icon">↔️</span>
          <span className="btn-text">콘텐츠 이동하기</span>
        </button>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              카드형
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              목록형
            </button>
          </div>
          <button className="toolbar-btn">필터</button>
          <button className="toolbar-btn blue">등록</button>
          <button className="toolbar-btn blue">일괄등록</button>
        </div>
      </div>

      <div className="divider"></div>

      {/* 콘텐츠 리스트 */}
      <div className="content-items-wrapper">
        {contents.map((content) => (
          <div key={content.id} className="content-card">
            <div className="card-layout">
              <input type="checkbox" className="card-checkbox" />

              <div className="card-thumbnail">
                <img src={content.thumbnail} alt={content.title} />
                <span className="thumbnail-badge">특징지도</span>
              </div>

              <div className="card-content">
                <div className="card-header-row">
                  <div className="card-badges">
                    <span className="badge gray">{content.category}</span>
                    <span className="badge gray">{content.school}</span>
                    <span className="badge gray">{content.grade}</span>
                    <span className="badge gray">{content.subject}</span>
                    {content.badges && content.badges.map((badge, idx) => (
                      <span key={idx} className="badge gray">{badge}</span>
                    ))}
                    <button className="badge-btn">📖 삭제</button>
                    <button className="badge-btn">📖 공유</button>
                    <button className="badge-btn">⚡ 수업 링크 생성</button>
                  </div>
                  <span className="aspen-tag">Aspen 편집</span>
                </div>

                <h3 className="card-title">{content.title}</h3>

                <div className="card-footer">
                  <div className="card-stats">
                    <span className="stat-item">
                      <span className="stat-icon">👁</span>
                      <span>{content.viewCount || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">📥</span>
                      <span>{content.downloadCount || 0}</span>
                    </span>
                    <span className="stat-item">
                      <span className="stat-icon">♡</span>
                      <span>{content.likeCount || 0}</span>
                    </span>
                    <span className="stat-date">{content.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
