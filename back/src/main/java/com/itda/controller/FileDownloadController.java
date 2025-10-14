package com.itda.controller;

import com.itda.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;

@Slf4j
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileDownloadController {

    private final FileUploadUtil fileUploadUtil;

    /**
     * 파일 다운로드
     */
    @GetMapping("/download/**")
    public ResponseEntity<Resource> downloadFile(@RequestParam String path) {
        log.info("파일 다운로드 요청: path={}", path);

        try {
            // 파일 경로 가져오기
            Path filePath = fileUploadUtil.getFullPath(path);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                log.error("파일을 읽을 수 없습니다: {}", path);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // 파일명 추출
            String filename = filePath.getFileName().toString();

            // Content-Disposition 헤더 설정
            String contentDisposition = "attachment; filename=\"" + filename + "\"";

            // MediaType 결정
            String extension = fileUploadUtil.getFileExtension(filename);
            MediaType mediaType = determineMediaType(extension);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);

        } catch (IllegalArgumentException e) {
            log.error("파일 다운로드 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (MalformedURLException e) {
            log.error("잘못된 파일 경로: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 파일 미리보기 (이미지, PDF 등)
     */
    @GetMapping("/preview/**")
    public ResponseEntity<Resource> previewFile(@RequestParam String path) {
        log.info("파일 미리보기 요청: path={}", path);

        try {
            Path filePath = fileUploadUtil.getFullPath(path);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                log.error("파일을 읽을 수 없습니다: {}", path);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String filename = filePath.getFileName().toString();
            String extension = fileUploadUtil.getFileExtension(filename);
            MediaType mediaType = determineMediaType(extension);

            // inline으로 설정하여 브라우저에서 바로 볼 수 있도록 함
            String contentDisposition = "inline; filename=\"" + filename + "\"";

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);

        } catch (IllegalArgumentException e) {
            log.error("파일 미리보기 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (MalformedURLException e) {
            log.error("잘못된 파일 경로: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * 파일 확장자에 따른 MediaType 결정
     */
    private MediaType determineMediaType(String extension) {
        return switch (extension.toLowerCase()) {
            // 이미지
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png" -> MediaType.IMAGE_PNG;
            case "gif" -> MediaType.IMAGE_GIF;
            case "svg" -> MediaType.valueOf("image/svg+xml");
            case "webp" -> MediaType.valueOf("image/webp");

            // 문서
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "doc", "docx" -> MediaType.valueOf("application/msword");
            case "xls", "xlsx" -> MediaType.valueOf("application/vnd.ms-excel");
            case "ppt", "pptx" -> MediaType.valueOf("application/vnd.ms-powerpoint");
            case "hwp" -> MediaType.valueOf("application/x-hwp");

            // 텍스트
            case "txt" -> MediaType.TEXT_PLAIN;
            case "html" -> MediaType.TEXT_HTML;
            case "css" -> MediaType.valueOf("text/css");
            case "js" -> MediaType.valueOf("application/javascript");
            case "json" -> MediaType.APPLICATION_JSON;
            case "xml" -> MediaType.APPLICATION_XML;

            // 비디오
            case "mp4" -> MediaType.valueOf("video/mp4");
            case "avi" -> MediaType.valueOf("video/x-msvideo");
            case "mov" -> MediaType.valueOf("video/quicktime");
            case "wmv" -> MediaType.valueOf("video/x-ms-wmv");
            case "webm" -> MediaType.valueOf("video/webm");

            // 오디오
            case "mp3" -> MediaType.valueOf("audio/mpeg");
            case "wav" -> MediaType.valueOf("audio/wav");
            case "ogg" -> MediaType.valueOf("audio/ogg");

            // 압축
            case "zip" -> MediaType.valueOf("application/zip");
            case "rar" -> MediaType.valueOf("application/x-rar-compressed");
            case "7z" -> MediaType.valueOf("application/x-7z-compressed");
            case "tar" -> MediaType.valueOf("application/x-tar");
            case "gz" -> MediaType.valueOf("application/gzip");

            // 기타
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
