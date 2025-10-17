-- 샘플 콘텐츠 데이터 추가
-- 기존 사용자 ID를 사용하여 샘플 데이터 생성
-- user_id = 2 (teacher01 - 김선생)
-- user_id = 3 (teacher02 - 이선생)

-- 기존 데이터 삭제 (필요한 경우)
-- DELETE FROM content WHERE user_id IN (2, 3);

-- 샘플 콘텐츠 데이터
INSERT INTO content (
    title, description, content_type, school_level, grade, semester, subject,
    achievement_standard, content_format, thumbnail_path, keywords, copyright_type, usage_condition,
    public_status, storage_type, user_id, view_count, like_count, download_count
) VALUES
(
    '초등 3학년 수학 - 분수의 이해',
    '분수의 기본 개념을 이해하고 실생활에서 활용할 수 있는 교육 자료입니다.',
    'school',
    'elementary',
    '3',
    '1',
    'math',
    '[4수01-11] 분수의 의미를 이해하고 읽고 쓸 수 있다',
    'attachment',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
    '수학,분수,초등수학,교육자료',
    'personal',
    'publicDomain',
    'public',
    'storage',
    2,
    128,
    15,
    8
),
(
    '중학교 영어 - 기본 문법 정리',
    '중학교 영어 기본 문법을 체계적으로 정리한 자료입니다.',
    'school',
    'middle',
    '1',
    '1',
    'english',
    '[9영01-01] 일상생활에 관한 간단한 문장을 듣고 세부 정보를 파악할 수 있다',
    'attachment',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
    '영어,문법,중학교,교육자료',
    'personal',
    'publicDomain',
    'public',
    'storage',
    3,
    256,
    32,
    18
),
(
    '고등학교 과학 - 화학 반응식',
    '고등학교 화학 반응식의 원리와 계산 방법을 다룬 자료입니다.',
    'school',
    'high',
    '2',
    '1',
    'science',
    '[10과06-01] 물질의 구성 입자를 이해하고 화학 반응식을 작성할 수 있다',
    'attachment',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop',
    '과학,화학,화학반응식,고등학교',
    'personal',
    'ccl',
    'public',
    'storage',
    3,
    89,
    12,
    5
),
(
    '초등학교 국어 - 동시 감상',
    '동시를 읽고 감상하는 방법을 익히는 수업 자료입니다.',
    'school',
    'elementary',
    '4',
    '2',
    'korean',
    '[4국05-05] 재미있거나 감동적인 부분을 실감나게 표현하며 읽는다',
    'attachment',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    '국어,동시,문학,초등학교',
    'personal',
    'publicDomain',
    'public',
    'storage',
    2,
    175,
    28,
    12
),
(
    '중학교 사회 - 세계 지리 탐험',
    '세계 여러 나라의 지리적 특성을 알아보는 자료입니다.',
    'school',
    'middle',
    '2',
    '1',
    'social',
    '[9사(지리)01-01] 세계 여러 지역의 자연환경과 인문환경을 비교한다',
    'url',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=300&fit=crop',
    '사회,지리,세계지리,중학교',
    'personal',
    'publicDomain',
    'public',
    'storage',
    3,
    203,
    41,
    22
),
(
    '창의력 향상 프로그램',
    '학생들의 창의적 사고력을 기르기 위한 비교과 프로그램입니다.',
    'non-school',
    'elementary',
    '5',
    NULL,
    NULL,
    NULL,
    'attachment',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    '창의력,사고력,비교과,프로그램',
    'personal',
    'publicDomain',
    'public',
    'storage',
    2,
    312,
    56,
    35
),
(
    '학급 운영 가이드',
    '효과적인 학급 운영을 위한 가이드 자료입니다.',
    'non-school',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'attachment',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
    '학급운영,가이드,교사,비교과',
    'personal',
    'ccl',
    'private',
    'storage',
    2,
    98,
    8,
    3
),
(
    '수학 문제 해결 전략',
    '다양한 수학 문제를 해결하기 위한 전략을 담은 자료입니다.',
    'school',
    'elementary',
    '6',
    '2',
    'math',
    '[6수01-01] 수학적 문제 해결 전략을 이해하고 적용할 수 있다',
    'attachment',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
    '수학,문제해결,전략,초등학교',
    'personal',
    'publicDomain',
    'public',
    'storage',
    2,
    445,
    78,
    42
);

-- 데이터 확인
-- teacher01 (user_id=2) 콘텐츠 조회
SELECT
    content_id,
    title,
    content_type,
    school_level,
    grade,
    semester,
    subject,
    public_status,
    view_count,
    like_count,
    created_at
FROM content
WHERE user_id = 2
ORDER BY created_at DESC;

-- teacher02 (user_id=3) 콘텐츠 조회
SELECT
    content_id,
    title,
    content_type,
    school_level,
    grade,
    semester,
    subject,
    public_status,
    view_count,
    like_count,
    created_at
FROM content
WHERE user_id = 3
ORDER BY created_at DESC;
