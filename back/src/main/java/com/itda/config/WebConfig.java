package com.itda.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 썸네일 이미지 정적 리소스 서빙
        registry.addResourceHandler("/thumbnail/**")
                .addResourceLocations("file:/app/asset/thumbnail/");

        // 콘텐츠 파일 정적 리소스 서빙
        registry.addResourceHandler("/content/**")
                .addResourceLocations("file:/app/asset/content/");
    }
}
