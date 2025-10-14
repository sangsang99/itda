package com.itda.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentRequest {

    // 기본 정보
    private String title;
    private String description;

    // 콘텐츠 분류
    private String contentType; // school, non-school, element
    private String schoolLevel;
    private String grade;
    private String semester;
    private String subject;
    private String achievementStandard;

    // 콘텐츠 형식
    private String contentFormat; // attachment, file, url
    private String contentUrl; // URL인 경우

    // 보조자료
    private Long parentContentId;
    private Boolean isSupportMaterial;

    // 키워드
    private String keywords; // 콤마로 구분

    // 저작권 정보
    private String copyrightType; // personal, shared
    private String usageCondition; // publicDomain, ccl, copyright, ofl

    // 공개 설정
    private String publicStatus; // public, private

    // 저장 위치
    private String storageType; // channel, storage
    private Long channelId;
    private String folderPath;
}
