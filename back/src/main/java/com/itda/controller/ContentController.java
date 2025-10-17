package com.itda.controller;

import com.itda.dto.ContentRequest;
import com.itda.dto.ContentResponse;
import com.itda.entity.User;
import com.itda.service.ContentService;
import com.itda.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:15173"})
public class ContentController {

    private final ContentService contentService;
    private final UserService userService;

    /**
     * 인증된 사용자 정보를 가져오는 헬퍼 메서드
     */
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증되지 않은 사용자입니다");
        }
        String username = authentication.getName();
        User user = userService.findByUsername(username);
        return user.getUserId();
    }

    /**
     * 콘텐츠 등록
     */
    @PostMapping
    public ResponseEntity<ContentResponse> createContent(
            @RequestPart("content") ContentRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {

        Long userId = getAuthenticatedUserId();
        log.info("콘텐츠 등록 요청: userId={}, title={}", userId, request.getTitle());

        try {
            ContentResponse response = contentService.createContent(request, file, thumbnail, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("콘텐츠 등록 실패: {}", e.getMessage(), e);
            throw new RuntimeException("콘텐츠 등록에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 콘텐츠 수정
     */
    @PutMapping("/{contentId}")
    public ResponseEntity<ContentResponse> updateContent(
            @PathVariable Long contentId,
            @RequestPart("content") ContentRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "thumbnail", required = false) MultipartFile thumbnail) {

        Long userId = getAuthenticatedUserId();
        log.info("콘텐츠 수정 요청: contentId={}, userId={}", contentId, userId);

        try {
            ContentResponse response = contentService.updateContent(contentId, request, file, thumbnail, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("콘텐츠 수정 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            log.error("콘텐츠 수정 실패: {}", e.getMessage(), e);
            throw new RuntimeException("콘텐츠 수정에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 콘텐츠 조회 (단건)
     */
    @GetMapping("/{contentId}")
    public ResponseEntity<ContentResponse> getContent(@PathVariable Long contentId) {
        log.info("콘텐츠 조회 요청: contentId={}", contentId);

        try {
            ContentResponse response = contentService.getContent(contentId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("콘텐츠 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 콘텐츠 삭제
     */
    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long contentId) {

        Long userId = getAuthenticatedUserId();
        log.info("콘텐츠 삭제 요청: contentId={}, userId={}", contentId, userId);

        try {
            contentService.deleteContent(contentId, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            log.error("콘텐츠 삭제 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    /**
     * 사용자별 콘텐츠 목록 조회
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ContentResponse>> getContentsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("사용자별 콘텐츠 목록 조회: userId={}, page={}, size={}", userId, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.getContentsByUser(userId, pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 공개 콘텐츠 목록 조회
     */
    @GetMapping("/public")
    public ResponseEntity<Page<ContentResponse>> getPublicContents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("공개 콘텐츠 목록 조회: page={}, size={}", page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.getPublicContents(pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 채널별 콘텐츠 목록 조회
     */
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<Page<ContentResponse>> getContentsByChannel(
            @PathVariable Long channelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("채널별 콘텐츠 목록 조회: channelId={}, page={}, size={}", channelId, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.getContentsByChannel(channelId, pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 콘텐츠 타입별 조회
     */
    @GetMapping("/type/{contentType}")
    public ResponseEntity<Page<ContentResponse>> getContentsByType(
            @PathVariable String contentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("콘텐츠 타입별 조회: contentType={}, page={}, size={}", contentType, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.getContentsByType(contentType, pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 보조자료 조회
     */
    @GetMapping("/{parentContentId}/support-materials")
    public ResponseEntity<List<ContentResponse>> getSupportMaterials(@PathVariable Long parentContentId) {
        log.info("보조자료 조회: parentContentId={}", parentContentId);

        List<ContentResponse> materials = contentService.getSupportMaterials(parentContentId);
        return ResponseEntity.ok(materials);
    }

    /**
     * 키워드 검색
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ContentResponse>> searchByKeyword(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("키워드 검색: keyword={}, page={}, size={}", keyword, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.searchByKeyword(keyword, pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 사용자의 폴더별 콘텐츠 조회
     */
    @GetMapping("/user/{userId}/folder")
    public ResponseEntity<Page<ContentResponse>> getContentsByUserAndFolder(
            @PathVariable Long userId,
            @RequestParam String folderPath,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        log.info("사용자 폴더별 콘텐츠 조회: userId={}, folderPath={}, page={}, size={}",
                userId, folderPath, page, size);

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<ContentResponse> contents = contentService.getContentsByUserAndFolder(userId, folderPath, pageable);
        return ResponseEntity.ok(contents);
    }

    /**
     * 좋아요
     */
    @PostMapping("/{contentId}/like")
    public ResponseEntity<Void> likeContent(@PathVariable Long contentId) {
        log.info("좋아요 요청: contentId={}", contentId);

        try {
            contentService.increaseLikeCount(contentId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("좋아요 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 다운로드 (다운로드 수 증가)
     */
    @PostMapping("/{contentId}/download")
    public ResponseEntity<Void> downloadContent(@PathVariable Long contentId) {
        log.info("다운로드 요청: contentId={}", contentId);

        try {
            contentService.increaseDownloadCount(contentId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("다운로드 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * 인기 콘텐츠 조회 (조회수 높은 순)
     */
    @GetMapping("/popular")
    public ResponseEntity<List<ContentResponse>> getPopularContents(
            @RequestParam(defaultValue = "10") int size) {
        log.info("인기 콘텐츠 조회: size={}", size);

        List<ContentResponse> contents = contentService.getPopularContents(size);
        return ResponseEntity.ok(contents);
    }
}
