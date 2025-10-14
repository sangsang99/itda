package com.itda.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Slf4j
@Component
public class FileUploadUtil {

    @Value("${file.upload.base-path:./asset}")
    private String basePath;

    private static final String CONTENT_DIR = "content";
    private static final String THUMBNAIL_DIR = "thumbnail";

    /**
     * 콘텐츠 파일 업로드
     */
    public String uploadContentFile(MultipartFile file, Long userId) {
        return uploadFile(file, userId, CONTENT_DIR);
    }

    /**
     * 썸네일 파일 업로드
     */
    public String uploadThumbnail(MultipartFile file, Long userId) {
        return uploadFile(file, userId, THUMBNAIL_DIR);
    }

    /**
     * 파일 업로드 공통 로직
     */
    private String uploadFile(MultipartFile file, Long userId, String subDir) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        try {
            // 파일 저장 경로 생성: {basePath}/{subDir}/{userId}/{yyyyMM}/{uuid}_{originalFilename}
            String dateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
            String uploadDir = String.format("%s/%s/%d/%s", basePath, subDir, userId, dateFolder);

            // 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = UUID.randomUUID().toString() + "_" + originalFilename;

            // 파일 저장
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 상대 경로 반환
            String relativePath = String.format("/%s/%d/%s/%s", subDir, userId, dateFolder, uniqueFilename);
            log.info("파일 업로드 완료: {}", relativePath);

            return relativePath;

        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage(), e);
            throw new RuntimeException("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 파일 삭제
     */
    public void deleteFile(String filePath) {
        if (filePath == null || filePath.isEmpty()) {
            return;
        }

        try {
            Path path = Paths.get(basePath + filePath);
            if (Files.exists(path)) {
                Files.delete(path);
                log.info("파일 삭제 완료: {}", filePath);
            }
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", e.getMessage(), e);
            // 파일 삭제 실패는 치명적이지 않으므로 예외를 던지지 않음
        }
    }

    /**
     * 파일 확장자 추출
     */
    public String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }

        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1).toLowerCase();
        }

        return "";
    }

    /**
     * 파일 다운로드를 위한 전체 경로 반환
     */
    public Path getFullPath(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            throw new IllegalArgumentException("파일 경로가 없습니다.");
        }

        Path path = Paths.get(basePath + relativePath);

        if (!Files.exists(path)) {
            throw new IllegalArgumentException("파일을 찾을 수 없습니다: " + relativePath);
        }

        return path;
    }

    /**
     * 파일 존재 여부 확인
     */
    public boolean fileExists(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            return false;
        }

        Path path = Paths.get(basePath + relativePath);
        return Files.exists(path);
    }

    /**
     * 파일 크기 반환
     */
    public long getFileSize(String relativePath) {
        if (relativePath == null || relativePath.isEmpty()) {
            return 0;
        }

        try {
            Path path = Paths.get(basePath + relativePath);
            if (Files.exists(path)) {
                return Files.size(path);
            }
        } catch (IOException e) {
            log.error("파일 크기 조회 실패: {}", e.getMessage(), e);
        }

        return 0;
    }
}
