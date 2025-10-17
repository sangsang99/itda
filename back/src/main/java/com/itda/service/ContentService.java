package com.itda.service;

import com.itda.dto.ContentRequest;
import com.itda.dto.ContentResponse;
import com.itda.entity.Content;
import com.itda.repository.ContentRepository;
import com.itda.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ContentRepository contentRepository;
    private final FileUploadUtil fileUploadUtil;

    /**
     * 콘텐츠 등록
     */
    @Transactional
    @CacheEvict(value = {"userContents", "popularContents"}, allEntries = true)
    public ContentResponse createContent(ContentRequest request, MultipartFile file, MultipartFile thumbnail, Long userId) {
        log.info("콘텐츠 등록 시작: userId={}, title={}", userId, request.getTitle());

        Content content = Content.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .contentType(request.getContentType())
                .schoolLevel(request.getSchoolLevel())
                .grade(request.getGrade())
                .semester(request.getSemester())
                .subject(request.getSubject())
                .achievementStandard(request.getAchievementStandard())
                .contentFormat(request.getContentFormat())
                .contentUrl(request.getContentUrl())
                .parentContentId(request.getParentContentId())
                .isSupportMaterial(request.getIsSupportMaterial() != null ? request.getIsSupportMaterial() : false)
                .keywords(request.getKeywords())
                .copyrightType(request.getCopyrightType())
                .usageCondition(request.getUsageCondition())
                .publicStatus(request.getPublicStatus() != null ? request.getPublicStatus() : "public")
                .storageType(request.getStorageType())
                .channelId(request.getChannelId())
                .folderPath(request.getFolderPath())
                .userId(userId)
                .viewCount(0L)
                .likeCount(0L)
                .downloadCount(0L)
                .build();

        // 파일 업로드 처리 (attachment 또는 file 타입)
        if (file != null && !file.isEmpty()) {
            String filePath = fileUploadUtil.uploadContentFile(file, userId);
            content.setFilePath(filePath);
            content.setFileName(file.getOriginalFilename());
            content.setFileSize(file.getSize());
            content.setFileExtension(fileUploadUtil.getFileExtension(file.getOriginalFilename()));
        }

        // 썸네일 업로드 처리
        if (thumbnail != null && !thumbnail.isEmpty()) {
            String thumbnailPath = fileUploadUtil.uploadThumbnail(thumbnail, userId);
            content.setThumbnailPath(thumbnailPath);
        } else {
            // 썸네일이 없으면 과목에 맞는 Unsplash 이미지 자동 설정
            String autoThumbnail = getDefaultThumbnailBySubject(request.getSubject());
            content.setThumbnailPath(autoThumbnail);
        }

        Content savedContent = contentRepository.save(content);
        log.info("콘텐츠 등록 완료: contentId={}", savedContent.getContentId());

        return ContentResponse.from(savedContent);
    }

    /**
     * 콘텐츠 수정
     */
    @Transactional
    public ContentResponse updateContent(Long contentId, ContentRequest request, MultipartFile file, MultipartFile thumbnail, Long userId) {
        log.info("콘텐츠 수정 시작: contentId={}, userId={}", contentId, userId);

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));

        // 권한 확인
        if (!content.getUserId().equals(userId)) {
            throw new IllegalArgumentException("콘텐츠 수정 권한이 없습니다.");
        }

        // 기본 정보 수정
        content.setTitle(request.getTitle());
        content.setDescription(request.getDescription());
        content.setContentType(request.getContentType());
        content.setSchoolLevel(request.getSchoolLevel());
        content.setGrade(request.getGrade());
        content.setSemester(request.getSemester());
        content.setSubject(request.getSubject());
        content.setAchievementStandard(request.getAchievementStandard());
        content.setContentFormat(request.getContentFormat());
        content.setContentUrl(request.getContentUrl());
        content.setParentContentId(request.getParentContentId());
        content.setIsSupportMaterial(request.getIsSupportMaterial());
        content.setKeywords(request.getKeywords());
        content.setCopyrightType(request.getCopyrightType());
        content.setUsageCondition(request.getUsageCondition());
        content.setPublicStatus(request.getPublicStatus());
        content.setStorageType(request.getStorageType());
        content.setChannelId(request.getChannelId());
        content.setFolderPath(request.getFolderPath());

        // 새 파일이 업로드된 경우
        if (file != null && !file.isEmpty()) {
            // 기존 파일 삭제
            if (content.getFilePath() != null) {
                fileUploadUtil.deleteFile(content.getFilePath());
            }

            String filePath = fileUploadUtil.uploadContentFile(file, userId);
            content.setFilePath(filePath);
            content.setFileName(file.getOriginalFilename());
            content.setFileSize(file.getSize());
            content.setFileExtension(fileUploadUtil.getFileExtension(file.getOriginalFilename()));
        }

        // 새 썸네일이 업로드된 경우
        if (thumbnail != null && !thumbnail.isEmpty()) {
            // 기존 썸네일 삭제
            if (content.getThumbnailPath() != null) {
                fileUploadUtil.deleteFile(content.getThumbnailPath());
            }

            String thumbnailPath = fileUploadUtil.uploadThumbnail(thumbnail, userId);
            content.setThumbnailPath(thumbnailPath);
        }

        Content updatedContent = contentRepository.save(content);
        log.info("콘텐츠 수정 완료: contentId={}", updatedContent.getContentId());

        return ContentResponse.from(updatedContent);
    }

    /**
     * 콘텐츠 조회 (단건)
     */
    @Transactional
    public ContentResponse getContent(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));

        // 조회수 증가
        content.setViewCount(content.getViewCount() + 1);
        contentRepository.save(content);

        return ContentResponse.from(content);
    }

    /**
     * 콘텐츠 삭제 (Soft Delete)
     */
    @Transactional
    @CacheEvict(value = {"userContents", "popularContents"}, allEntries = true)
    public void deleteContent(Long contentId, Long userId) {
        log.info("콘텐츠 삭제 시작: contentId={}, userId={}", contentId, userId);

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));

        // 권한 확인
        if (!content.getUserId().equals(userId)) {
            throw new IllegalArgumentException("콘텐츠 삭제 권한이 없습니다.");
        }

        contentRepository.delete(content); // Soft delete
        log.info("콘텐츠 삭제 완료: contentId={}", contentId);
    }

    /**
     * 사용자별 콘텐츠 목록 조회 (캐싱 적용)
     */
    @Cacheable(value = "userContents", key = "#userId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<ContentResponse> getContentsByUser(Long userId, Pageable pageable) {
        log.info("DB에서 사용자 콘텐츠 조회: userId={}", userId);
        Page<Content> contents = contentRepository.findByUserId(userId, pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 공개 콘텐츠 목록 조회
     */
    public Page<ContentResponse> getPublicContents(Pageable pageable) {
        Page<Content> contents = contentRepository.findByPublicStatus("public", pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 채널별 콘텐츠 목록 조회
     */
    public Page<ContentResponse> getContentsByChannel(Long channelId, Pageable pageable) {
        Page<Content> contents = contentRepository.findByChannelId(channelId, pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 콘텐츠 타입별 조회
     */
    public Page<ContentResponse> getContentsByType(String contentType, Pageable pageable) {
        Page<Content> contents = contentRepository.findByContentType(contentType, pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 보조자료 조회
     */
    public List<ContentResponse> getSupportMaterials(Long parentContentId) {
        List<Content> contents = contentRepository.findByParentContentId(parentContentId);
        return contents.stream()
                .map(ContentResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 키워드 검색
     */
    public Page<ContentResponse> searchByKeyword(String keyword, Pageable pageable) {
        Page<Content> contents = contentRepository.searchByKeyword(keyword, pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 사용자의 폴더별 콘텐츠 조회
     */
    public Page<ContentResponse> getContentsByUserAndFolder(Long userId, String folderPath, Pageable pageable) {
        Page<Content> contents = contentRepository.findByUserIdAndFolderPath(userId, folderPath, pageable);
        return contents.map(ContentResponse::from);
    }

    /**
     * 좋아요 수 증가
     */
    @Transactional
    public void increaseLikeCount(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));
        content.setLikeCount(content.getLikeCount() + 1);
        contentRepository.save(content);
    }

    /**
     * 다운로드 수 증가
     */
    @Transactional
    public void increaseDownloadCount(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new IllegalArgumentException("콘텐츠를 찾을 수 없습니다: " + contentId));
        content.setDownloadCount(content.getDownloadCount() + 1);
        contentRepository.save(content);
    }

    /**
     * 인기 콘텐츠 조회 (조회수 높은 순, 캐싱 적용)
     */
    @Cacheable(value = "popularContents", key = "#size")
    public List<ContentResponse> getPopularContents(int size) {
        log.info("DB에서 인기 콘텐츠 조회: size={}", size);
        Pageable pageable = PageRequest.of(0, size, Sort.by(Sort.Direction.DESC, "viewCount"));
        Page<Content> contents = contentRepository.findByPublicStatus("public", pageable);
        return contents.stream()
                .map(ContentResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 과목별 기본 썸네일 반환 (Unsplash 이미지)
     */
    private String getDefaultThumbnailBySubject(String subject) {
        if (subject == null) {
            return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"; // 기본 교육 이미지
        }

        return switch (subject.toLowerCase()) {
            case "math" -> "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop"; // 수학
            case "korean" -> "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop"; // 국어/책
            case "english" -> "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop"; // 영어
            case "science" -> "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop"; // 과학
            case "social" -> "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=400&h=300&fit=crop"; // 사회
            default -> "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop"; // 기본 교육 이미지
        };
    }
}
