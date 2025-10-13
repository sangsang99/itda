// 기본 이미지 경로
export const DEFAULT_IMAGES = {
  thumbnail: '/default-thumbnail.png',
  profile: '/default-profile.png',
  logo: '/default-logo.png',
};

/**
 * 이미지 로드 실패 시 디폴트 이미지로 대체
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  defaultImage: string = DEFAULT_IMAGES.thumbnail
) => {
  const img = event.currentTarget;
  if (img.src !== defaultImage) {
    img.src = defaultImage;
  }
};

/**
 * 이미지 URL이 유효한지 확인하고 디폴트 이미지 반환
 */
export const getValidImageUrl = (
  url: string | undefined | null,
  defaultImage: string = DEFAULT_IMAGES.thumbnail
): string => {
  if (!url || url.trim() === '') {
    return defaultImage;
  }
  return url;
};

/**
 * SVG 디폴트 썸네일 생성
 */
export const createDefaultThumbnail = (text: string = 'No Image'): string => {
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="18" fill="#999" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * 프로필 이미지 디폴트
 */
export const DEFAULT_PROFILE_SVG = `data:image/svg+xml;base64,${btoa(`
  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#e0e0e0"/>
    <circle cx="50" cy="40" r="20" fill="#999"/>
    <path d="M 30 80 Q 50 60, 70 80" fill="#999"/>
  </svg>
`)}`;
