import { useState } from 'react';
import './ContentList.css';
import type { ContentItem } from '../../types';
import { toggleLike as toggleLikeApi } from '../../services/apiService';
import { handleImageError, createDefaultThumbnail } from '../../utils/imageUtils';

interface ContentListProps {
  title: string;
  contents: ContentItem[];
  onContentClick?: (contentId: string) => void;
  showCategories?: boolean;
  categories?: string[];
  onCategoryChange?: (category: string) => void;
}

export const ContentList = ({
  title,
  contents,
  onContentClick,
  showCategories = false,
  categories = [],
  onCategoryChange,
}: ContentListProps) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [items, setItems] = useState(contents);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange?.(category);
  };

  const handleLike = async (e: React.MouseEvent, content: ContentItem) => {
    e.stopPropagation();

    try {
      const result = await toggleLikeApi(content.id, content.type === 'package' ? 'package' : 'contents');

      if (result.success) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === content.id
              ? { ...item, liked: !item.liked, likeCount: result.likeCount }
              : item
          )
        );
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleContentClick = (contentId: string) => {
    if (onContentClick) {
      onContentClick(contentId);
    } else {
      // 기본 동작: 상세 페이지로 이동
      window.location.href = `/viewer/view.do?lrnCntntsNo=${contentId}`;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      package: '꾸러미',
      contents: '콘텐츠',
      question: '문항',
      exam: '시험지',
    };
    return typeMap[type] || type;
  };

  return (
    <section className="content-list-section">
      <div className="content-list-header">
        <h2 className="content-list-title">{title}</h2>

        {showCategories && categories.length > 0 && (
          <div className="content-categories">
            <button
              className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="content-grid">
        {items.map((content) => (
          <div
            key={content.id}
            className="content-card"
            onClick={() => handleContentClick(content.id)}
          >
            <div className="content-thumbnail">
              <img
                src={content.thumbnail || createDefaultThumbnail(content.title)}
                alt={content.title}
                onError={(e) => handleImageError(e, createDefaultThumbnail('이미지 없음'))}
              />
              {content.badges && content.badges.length > 0 && (
                <div className="content-badges">
                  {content.badges.map((badge, index) => (
                    <span key={index} className="badge">{badge}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="content-info">
              <div className="content-meta">
                <span className="content-type">{getTypeLabel(content.type)}</span>
                <span className="content-category">{content.category}</span>
              </div>

              <h3 className="content-title">{content.title}</h3>

              <div className="content-details">
                <span className="content-channel">{content.channelName}</span>
                <span className="content-path">
                  {content.school} &gt; {content.grade}학년 &gt; {content.subject}
                </span>
              </div>

              <div className="content-actions">
                <button
                  className={`like-btn ${content.liked ? 'liked' : ''}`}
                  onClick={(e) => handleLike(e, content)}
                >
                  <span className="like-icon">♥</span>
                  <span className="like-count">{content.likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="empty-content">
          <p>콘텐츠가 없습니다.</p>
        </div>
      )}
    </section>
  );
};
