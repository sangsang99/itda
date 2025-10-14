-- 콘텐츠 테이블 (교육자료 등록용)
CREATE TABLE IF NOT EXISTS content (
    content_id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '콘텐츠 ID',

    -- 기본 정보
    title VARCHAR(255) NOT NULL COMMENT '콘텐츠명',
    description TEXT COMMENT '설명',

    -- 콘텐츠 분류
    content_type VARCHAR(50) NOT NULL COMMENT '콘텐츠 분류: school(교과), non-school(비교과), element(요소자료)',
    school_level VARCHAR(50) COMMENT '학교급: elementary, middle, high',
    grade VARCHAR(10) COMMENT '학년: 1, 2, 3',
    semester VARCHAR(10) COMMENT '학기: 1, 2',
    subject VARCHAR(100) COMMENT '과목명',
    achievement_standard TEXT COMMENT '성취기준/단원',

    -- 콘텐츠 형식
    content_format VARCHAR(50) NOT NULL COMMENT '콘텐츠 형식: attachment(첨부), file(파일), url(URL)',
    content_url VARCHAR(500) COMMENT '외부 URL (content_format=url인 경우)',
    file_path VARCHAR(500) COMMENT '파일 저장 경로',
    file_name VARCHAR(255) COMMENT '원본 파일명',
    file_size BIGINT COMMENT '파일 크기(bytes)',
    file_extension VARCHAR(50) COMMENT '파일 확장자',

    -- 보조자료
    parent_content_id BIGINT COMMENT '부모 콘텐츠 ID (보조자료인 경우)',
    is_support_material BOOLEAN DEFAULT FALSE COMMENT '보조자료 여부',

    -- 대표 이미지
    thumbnail_path VARCHAR(500) COMMENT '대표 이미지 경로',

    -- 키워드
    keywords TEXT COMMENT '키워드 (콤마로 구분)',

    -- 저작권 정보
    copyright_type VARCHAR(50) NOT NULL COMMENT '저작권: personal(이용허락), shared(허락필요)',
    usage_condition VARCHAR(50) COMMENT '이용조건: publicDomain, ccl, copyright, ofl',

    -- 공개 설정
    public_status VARCHAR(50) NOT NULL DEFAULT 'public' COMMENT '공개여부: public, private',

    -- 저장 위치
    storage_type VARCHAR(50) NOT NULL COMMENT '저장타입: channel, storage',
    channel_id BIGINT COMMENT '채널 ID',
    folder_path VARCHAR(500) COMMENT '보관함 폴더 경로',

    -- 작성자 정보
    user_id BIGINT NOT NULL COMMENT '작성자 ID',

    -- 통계
    view_count BIGINT DEFAULT 0 COMMENT '조회수',
    like_count BIGINT DEFAULT 0 COMMENT '좋아요수',
    download_count BIGINT DEFAULT 0 COMMENT '다운로드수',

    -- 메타 정보
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',
    deleted_at TIMESTAMP NULL COMMENT '삭제일시 (soft delete)',

    -- 인덱스
    INDEX idx_content_user_id (user_id),
    INDEX idx_content_content_type (content_type),
    INDEX idx_content_parent_content (parent_content_id),
    INDEX idx_content_channel_id (channel_id),
    INDEX idx_content_public_status (public_status),
    INDEX idx_content_created_at (created_at),
    INDEX idx_content_deleted_at (deleted_at),

    -- 외래키
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES channels(channel_id) ON DELETE SET NULL,
    FOREIGN KEY (parent_content_id) REFERENCES content(content_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='교육 콘텐츠 (등록용)';

-- 샘플 데이터 (실제 user_id 사용)
-- INSERT INTO content (
--     title, description, content_type, school_level, grade, semester, subject,
--     content_format, keywords, copyright_type, usage_condition,
--     public_status, storage_type, user_id
-- ) VALUES
-- (
--     '초등 3학년 수학 - 분수의 이해',
--     '분수의 기본 개념을 이해하고 실생활에서 활용할 수 있는 교육 자료입니다.',
--     'school',
--     'elementary',
--     '3',
--     '1',
--     'math',
--     'file',
--     '수학,분수,초등수학,교육자료',
--     'personal',
--     'publicDomain',
--     'public',
--     'storage',
--     8
-- );
