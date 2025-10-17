-- "teacher" 사용자 추가 (JWT 토큰에서 사용하는 username)
-- password: password123

-- 기존 teacher 사용자 확인
SELECT user_id, username, email, full_name, user_type
FROM users
WHERE username = 'teacher';

-- teacher 사용자가 없으면 추가
INSERT INTO users (username, email, password_hash, full_name, user_type, school_name, grade_level)
SELECT 'teacher', 'teacher@school.kr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM7lhvRS/pjgzK4cjsDG', '선생님', 'TEACHER', '테스트학교', '담임'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'teacher'
);

-- 추가된 사용자 확인
SELECT user_id, username, email, full_name, user_type
FROM users
WHERE username = 'teacher';

-- teacher 사용자의 샘플 콘텐츠 추가 (user_id를 동적으로 가져와서 사용)
INSERT INTO content (
    title, description, content_type, school_level, grade, semester, subject,
    achievement_standard, content_format, keywords, copyright_type, usage_condition,
    public_status, storage_type, user_id, view_count, like_count, download_count
)
SELECT
    '초등 5학년 과학 - 태양계 탐험',
    '태양계의 행성들과 특징을 알아보는 자료입니다.',
    'school',
    'elementary',
    '5',
    '1',
    'science',
    '[6과01-01] 태양계를 구성하는 천체의 특징을 설명할 수 있다',
    'attachment',
    '과학,태양계,행성,초등학교',
    'personal',
    'publicDomain',
    'public',
    'storage',
    u.user_id,
    89,
    12,
    5
FROM users u
WHERE u.username = 'teacher'
AND NOT EXISTS (
    SELECT 1 FROM content c
    WHERE c.user_id = u.user_id
    AND c.title = '초등 5학년 과학 - 태양계 탐험'
);

-- teacher 사용자 콘텐츠 확인
SELECT
    c.content_id,
    c.title,
    c.content_type,
    c.school_level,
    c.grade,
    c.semester,
    c.subject,
    c.public_status,
    c.created_at,
    u.username,
    u.full_name
FROM content c
JOIN users u ON c.user_id = u.user_id
WHERE u.username = 'teacher'
ORDER BY c.created_at DESC;
