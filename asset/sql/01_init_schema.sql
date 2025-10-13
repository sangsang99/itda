-- ITDA Database Schema Initialization
-- 생성일: 2025-09-25

SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '사용자명',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '이메일',
    password_hash VARCHAR(255) NOT NULL COMMENT '패스워드 해시',
    full_name VARCHAR(100) NOT NULL COMMENT '전체 이름',
    user_type ENUM('STUDENT', 'TEACHER', 'ADMIN') NOT NULL DEFAULT 'STUDENT' COMMENT '사용자 타입',
    school_name VARCHAR(100) COMMENT '학교명',
    grade_level VARCHAR(20) COMMENT '학년/직급',
    phone VARCHAR(20) COMMENT '연락처',
    profile_image_url VARCHAR(500) COMMENT '프로필 이미지 URL',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성 상태',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '이메일 인증 여부',
    last_login_at TIMESTAMP NULL COMMENT '마지막 로그인',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 정보';

-- 채널 테이블
CREATE TABLE IF NOT EXISTS channels (
    channel_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '채널 ID',
    owner_id BIGINT NOT NULL COMMENT '채널 소유자 ID',
    channel_name VARCHAR(100) NOT NULL COMMENT '채널명',
    channel_description TEXT COMMENT '채널 설명',
    channel_type ENUM('TEACHER', 'YEARLY', 'PRODUCTION_TEAM', 'INSTITUTION') NOT NULL COMMENT '채널 타입',
    channel_image_url VARCHAR(500) COMMENT '채널 이미지 URL',
    is_approved BOOLEAN DEFAULT FALSE COMMENT '승인 상태',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성 상태',
    subscriber_count INT DEFAULT 0 COMMENT '구독자 수',
    content_count INT DEFAULT 0 COMMENT '콘텐츠 수',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_channels_owner_id (owner_id),
    INDEX idx_channels_type (channel_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채널 정보';

-- 콘텐츠 테이블
CREATE TABLE IF NOT EXISTS contents (
    content_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '콘텐츠 ID',
    channel_id BIGINT NOT NULL COMMENT '채널 ID',
    title VARCHAR(200) NOT NULL COMMENT '제목',
    description TEXT COMMENT '설명',
    content_type ENUM('CURRICULUM', 'EXTRACURRICULAR', 'ELEMENT') NOT NULL COMMENT '콘텐츠 타입',
    subject VARCHAR(50) COMMENT '교과목',
    grade_level VARCHAR(20) COMMENT '학년',
    file_url VARCHAR(500) COMMENT '파일 URL',
    external_url VARCHAR(500) COMMENT '외부 링크 URL',
    thumbnail_url VARCHAR(500) COMMENT '썸네일 이미지 URL',
    view_count INT DEFAULT 0 COMMENT '조회수',
    like_count INT DEFAULT 0 COMMENT '좋아요 수',
    download_count INT DEFAULT 0 COMMENT '다운로드 수',
    is_public BOOLEAN DEFAULT TRUE COMMENT '공개 여부',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '추천 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE,
    INDEX idx_contents_channel_id (channel_id),
    INDEX idx_contents_type (content_type),
    INDEX idx_contents_subject (subject),
    INDEX idx_contents_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='콘텐츠 정보';

-- 꾸러미 테이블
CREATE TABLE IF NOT EXISTS packages (
    package_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '꾸러미 ID',
    channel_id BIGINT NOT NULL COMMENT '채널 ID',
    title VARCHAR(200) NOT NULL COMMENT '제목',
    description TEXT COMMENT '설명',
    subject VARCHAR(50) COMMENT '교과목',
    grade_level VARCHAR(20) COMMENT '학년',
    lesson_plan TEXT COMMENT '수업안',
    thumbnail_url VARCHAR(500) COMMENT '썸네일 이미지 URL',
    view_count INT DEFAULT 0 COMMENT '조회수',
    like_count INT DEFAULT 0 COMMENT '좋아요 수',
    is_public BOOLEAN DEFAULT TRUE COMMENT '공개 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE,
    INDEX idx_packages_channel_id (channel_id),
    INDEX idx_packages_subject (subject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='꾸러미 정보';

-- 꾸러미-콘텐츠 연결 테이블
CREATE TABLE IF NOT EXISTS package_contents (
    package_id BIGINT NOT NULL COMMENT '꾸러미 ID',
    content_id BIGINT NOT NULL COMMENT '콘텐츠 ID',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '정렬 순서',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    PRIMARY KEY (package_id, content_id),
    FOREIGN KEY (package_id) REFERENCES packages(package_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES contents(content_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='꾸러미-콘텐츠 연결';

-- 구독 테이블
CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '구독 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    channel_id BIGINT NOT NULL COMMENT '채널 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '구독일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_channel (user_id, channel_id),
    INDEX idx_subscriptions_user_id (user_id),
    INDEX idx_subscriptions_channel_id (channel_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='채널 구독 정보';

-- 보관함 테이블
CREATE TABLE IF NOT EXISTS storage (
    storage_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '보관함 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    item_type ENUM('CONTENT', 'PACKAGE', 'QUESTION', 'EXAM') NOT NULL COMMENT '아이템 타입',
    item_id BIGINT NOT NULL COMMENT '아이템 ID',
    storage_type ENUM('BOOKMARK', 'LIKE', 'SHARE', 'DOWNLOAD') NOT NULL COMMENT '보관 타입',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '보관일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_item_type (user_id, item_type, item_id, storage_type),
    INDEX idx_storage_user_id (user_id),
    INDEX idx_storage_item (item_type, item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 보관함';

-- 검색 기록 테이블
CREATE TABLE IF NOT EXISTS search_history (
    search_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '검색 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    search_keyword VARCHAR(200) NOT NULL COMMENT '검색어',
    search_count INT DEFAULT 1 COMMENT '검색 횟수',
    last_searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 검색일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_keyword (user_id, search_keyword),
    INDEX idx_search_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='검색 기록';

-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '알림 ID',
    user_id BIGINT NOT NULL COMMENT '사용자 ID',
    title VARCHAR(200) NOT NULL COMMENT '알림 제목',
    message TEXT NOT NULL COMMENT '알림 내용',
    notification_type ENUM('SYSTEM', 'CHANNEL', 'CONTENT', 'MESSAGE') NOT NULL COMMENT '알림 타입',
    is_read BOOLEAN DEFAULT FALSE COMMENT '읽음 여부',
    related_id BIGINT COMMENT '관련 항목 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='알림 정보';