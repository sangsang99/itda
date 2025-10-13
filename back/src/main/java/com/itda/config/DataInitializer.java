package com.itda.config;

import com.itda.entity.User;
import com.itda.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
    }

    private void initializeUsers() {
        // 테스트용 사용자가 없는 경우에만 생성
        if (userRepository.count() == 0) {
            // 학생 계정
            User student = new User();
            student.setUsername("student");
            student.setEmail("student@itda.com");
            student.setPasswordHash(passwordEncoder.encode("password"));
            student.setFullName("김학생");
            student.setUserType(User.UserType.STUDENT);
            student.setSchoolName("잇다초등학교");
            student.setGradeLevel("3학년");
            userRepository.save(student);

            // 교사 계정
            User teacher = new User();
            teacher.setUsername("teacher");
            teacher.setEmail("teacher@itda.com");
            teacher.setPasswordHash(passwordEncoder.encode("password"));
            teacher.setFullName("이선생");
            teacher.setUserType(User.UserType.TEACHER);
            teacher.setSchoolName("잇다초등학교");
            teacher.setGradeLevel("담임교사");
            userRepository.save(teacher);

            // 관리자 계정
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@itda.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("관리자");
            admin.setUserType(User.UserType.ADMIN);
            userRepository.save(admin);

            log.info("초기 테스트 사용자 데이터가 생성되었습니다:");
            log.info("학생: username=student, password=password");
            log.info("교사: username=teacher, password=password");
            log.info("관리자: username=admin, password=admin123");
        } else {
            log.info("사용자 데이터가 이미 존재합니다. 초기화를 건너뜁니다.");
        }
    }
}