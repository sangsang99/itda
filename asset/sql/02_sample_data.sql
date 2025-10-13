-- ITDA Sample Data
-- 생성일: 2025-09-25

SET NAMES utf8mb4;

-- 샘플 사용자 데이터
INSERT INTO users (username, email, password_hash, full_name, user_type, school_name, grade_level) VALUES
('admin', 'admin@itda.co.kr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM7lhvRS/pjgzK4cjsDG', '관리자', 'ADMIN', 'ITDA본사', '관리자'),
('teacher01', 'teacher01@school.kr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM7lhvRS/pjgzK4cjsDG', '김선생', 'TEACHER', '서울초등학교', '3학년'),
('teacher02', 'teacher02@school.kr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM7lhvRS/pjgzK4cjsDG', '이선생', 'TEACHER', '부산중학교', '1학년'),
('student01', 'student01@school.kr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM7lhvRS/pjgzK4cjsDG', '박학생', 'STUDENT', '서울고등학교', '2학년');

-- 샘플 채널 데이터
INSERT INTO channels (owner_id, channel_name, channel_description, channel_type, is_approved) VALUES
(2, '김선생의 수학교실', '초등학교 3학년 수학 전문 채널입니다.', 'TEACHER', TRUE),
(3, '이선생의 과학실험실', '중학교 과학 실험과 이론을 다루는 채널입니다.', 'TEACHER', TRUE),
(1, '올해의 우수 채널', '2024년 올해의 채널로 선정된 우수 콘텐츠 모음', 'YEARLY', TRUE);

-- 샘플 콘텐츠 데이터
INSERT INTO contents (channel_id, title, description, content_type, subject, grade_level, view_count, like_count) VALUES
(1, '분수의 기초 이해하기', '분수의 개념과 기본 연산을 학습할 수 있는 자료입니다.', 'CURRICULUM', '수학', '3학년', 125, 23),
(1, '도형의 넓이 구하기', '다양한 도형의 넓이를 구하는 방법을 배우는 콘텐츠입니다.', 'CURRICULUM', '수학', '3학년', 98, 18),
(2, '물의 순환과정', '물의 순환과정을 실험을 통해 이해하는 과학 자료입니다.', 'CURRICULUM', '과학', '1학년', 234, 45),
(2, '산과 염기 실험', '산과 염기의 성질을 알아보는 실험 자료입니다.', 'CURRICULUM', '과학', '1학년', 187, 32),
(3, '창의적 사고력 기르기', '학생들의 창의적 사고력 향상을 위한 활동 자료입니다.', 'EXTRACURRICULAR', '창의', '전학년', 156, 28);

-- 샘플 꾸러미 데이터
INSERT INTO packages (channel_id, title, description, subject, grade_level, lesson_plan, view_count, like_count) VALUES
(1, '3학년 분수 완전정복', '분수의 기초부터 응용까지 체계적으로 학습하는 꾸러미입니다.', '수학', '3학년', '1차시: 분수의 개념\n2차시: 분수의 크기 비교\n3차시: 분수의 덧셈과 뺄셈', 67, 15),
(2, '중학교 과학실험 모음', '중학교 1학년 과학 교육과정에 맞는 실험 자료 모음입니다.', '과학', '1학년', '1단원: 물질의 상태\n2단원: 산과 염기\n3단원: 생물의 다양성', 89, 21);

-- 샘플 꾸러미-콘텐츠 연결 데이터
INSERT INTO package_contents (package_id, content_id, sort_order) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(2, 4, 2);

-- 샘플 구독 데이터
INSERT INTO subscriptions (user_id, channel_id) VALUES
(4, 1),
(4, 2),
(2, 3),
(3, 1);

-- 샘플 보관함 데이터
INSERT INTO storage (user_id, item_type, item_id, storage_type) VALUES
(4, 'CONTENT', 1, 'BOOKMARK'),
(4, 'CONTENT', 3, 'LIKE'),
(4, 'PACKAGE', 1, 'BOOKMARK'),
(2, 'CONTENT', 5, 'LIKE');

-- 샘플 검색 기록 데이터
INSERT INTO search_history (user_id, search_keyword, search_count) VALUES
(4, '수학', 5),
(4, '과학실험', 3),
(4, '분수', 2),
(2, '창의활동', 1);

-- 샘플 알림 데이터
INSERT INTO notifications (user_id, title, message, notification_type, related_id) VALUES
(4, '새로운 콘텐츠 업데이트', '구독하신 김선생의 수학교실에 새로운 콘텐츠가 업로드되었습니다.', 'CHANNEL', 1),
(2, '시스템 점검 안내', '2025년 9월 26일 02:00~04:00 시스템 점검이 예정되어 있습니다.', 'SYSTEM', NULL),
(3, '채널 승인 완료', '신청하신 채널이 승인되었습니다. 이제 콘텐츠를 업로드하실 수 있습니다.', 'SYSTEM', 2);

-- 초기 설정 완료 확인
SELECT 'Database initialization completed' as status;