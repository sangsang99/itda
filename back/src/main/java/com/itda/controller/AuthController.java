package com.itda.controller;

import com.itda.dto.LoginRequest;
import com.itda.dto.LoginResponse;
import com.itda.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
@Slf4j
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = userService.login(loginRequest);
            log.info("User {} logged in successfully", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed for user {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // JWT는 stateless하므로 클라이언트에서 토큰을 삭제하면 됨
        return ResponseEntity.ok(new MessageResponse("로그아웃되었습니다"));
    }

    // 에러 응답을 위한 내부 클래스
    private static class ErrorResponse {
        private String message;
        private long timestamp = System.currentTimeMillis();

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }

    // 메시지 응답을 위한 내부 클래스
    private static class MessageResponse {
        private String message;
        private long timestamp = System.currentTimeMillis();

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}