package com.itda.dto;

import com.itda.entity.Content;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentResponse {

    private Long contentId;
    private String title;
    private String description;

    // 콘텐츠 분류
    private String contentType;
    private String schoolLevel;
    private String grade;
    private String semester;
    private String subject;
    private String achievementStandard;

    // 콘텐츠 형식
    private String contentFormat;
    private String contentUrl;
    private String fileName;
    private Long fileSize;
    private String fileExtension;

    // 보조자료
    private Long parentContentId;
    private Boolean isSupportMaterial;

    // 대표 이미지
    private String thumbnailPath;

    // 키워드
    private String keywords;

    // 저작권 정보
    private String copyrightType;
    private String usageCondition;

    // 공개 설정
    private String publicStatus;

    // 저장 위치
    private String storageType;
    private Long channelId;
    private String folderPath;

    // 작성자 정보
    private Long userId;

    // 통계
    private Long viewCount;
    private Long likeCount;
    private Long downloadCount;

    // 메타 정보
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ContentResponse from(Content content) {
        return ContentResponse.builder()
                .contentId(content.getContentId())
                .title(content.getTitle())
                .description(content.getDescription())
                .contentType(content.getContentType())
                .schoolLevel(content.getSchoolLevel())
                .grade(content.getGrade())
                .semester(content.getSemester())
                .subject(content.getSubject())
                .achievementStandard(content.getAchievementStandard())
                .contentFormat(content.getContentFormat())
                .contentUrl(content.getContentUrl())
                .fileName(content.getFileName())
                .fileSize(content.getFileSize())
                .fileExtension(content.getFileExtension())
                .parentContentId(content.getParentContentId())
                .isSupportMaterial(content.getIsSupportMaterial())
                .thumbnailPath(content.getThumbnailPath())
                .keywords(content.getKeywords())
                .copyrightType(content.getCopyrightType())
                .usageCondition(content.getUsageCondition())
                .publicStatus(content.getPublicStatus())
                .storageType(content.getStorageType())
                .channelId(content.getChannelId())
                .folderPath(content.getFolderPath())
                .userId(content.getUserId())
                .viewCount(content.getViewCount())
                .likeCount(content.getLikeCount())
                .downloadCount(content.getDownloadCount())
                .createdAt(content.getCreatedAt())
                .updatedAt(content.getUpdatedAt())
                .build();
    }
}
