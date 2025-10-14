package com.itda.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

import java.time.LocalDateTime;

@Entity
@Table(name = "content")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE content SET deleted_at = NOW() WHERE content_id = ?")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId;

    // 기본 정보
    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // 콘텐츠 분류
    @Column(name = "content_type", nullable = false, length = 50)
    private String contentType; // school, non-school, element

    @Column(name = "school_level", length = 50)
    private String schoolLevel; // elementary, middle, high

    @Column(length = 10)
    private String grade;

    @Column(length = 10)
    private String semester;

    @Column(length = 100)
    private String subject;

    @Column(name = "achievement_standard", columnDefinition = "TEXT")
    private String achievementStandard;

    // 콘텐츠 형식
    @Column(name = "content_format", nullable = false, length = 50)
    private String contentFormat; // attachment, file, url

    @Column(name = "content_url", length = 500)
    private String contentUrl;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_extension", length = 50)
    private String fileExtension;

    // 보조자료
    @Column(name = "parent_content_id")
    private Long parentContentId;

    @Column(name = "is_support_material")
    private Boolean isSupportMaterial = false;

    // 대표 이미지
    @Column(name = "thumbnail_path", length = 500)
    private String thumbnailPath;

    // 키워드
    @Column(columnDefinition = "TEXT")
    private String keywords;

    // 저작권 정보
    @Column(name = "copyright_type", nullable = false, length = 50)
    private String copyrightType; // personal, shared

    @Column(name = "usage_condition", length = 50)
    private String usageCondition; // publicDomain, ccl, copyright, ofl

    // 공개 설정
    @Column(name = "public_status", nullable = false, length = 50)
    private String publicStatus = "public"; // public, private

    // 저장 위치
    @Column(name = "storage_type", nullable = false, length = 50)
    private String storageType; // channel, storage

    @Column(name = "channel_id")
    private Long channelId;

    @Column(name = "folder_path", length = 500)
    private String folderPath;

    // 작성자 정보 (users 테이블의 user_id 참조)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 통계
    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "like_count")
    private Long likeCount = 0L;

    @Column(name = "download_count")
    private Long downloadCount = 0L;

    // 메타 정보
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
