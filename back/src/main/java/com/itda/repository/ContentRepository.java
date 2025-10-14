package com.itda.repository;

import com.itda.entity.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {

    // 사용자별 콘텐츠 조회
    Page<Content> findByUserId(Long userId, Pageable pageable);

    // 공개 콘텐츠 조회
    Page<Content> findByPublicStatus(String publicStatus, Pageable pageable);

    // 콘텐츠 타입별 조회
    Page<Content> findByContentType(String contentType, Pageable pageable);

    // 채널별 콘텐츠 조회
    Page<Content> findByChannelId(Long channelId, Pageable pageable);

    // 보조자료 조회
    List<Content> findByParentContentId(Long parentContentId);

    // 키워드 검색
    @Query("SELECT c FROM Content c WHERE c.keywords LIKE %:keyword%")
    Page<Content> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    // 사용자의 폴더별 콘텐츠 조회
    Page<Content> findByUserIdAndFolderPath(Long userId, String folderPath, Pageable pageable);
}
