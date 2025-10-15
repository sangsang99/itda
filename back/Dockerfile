# Multi-stage build for Spring Boot application

# Build stage using Gradle image
FROM gradle:8.4-jdk17 AS builder

WORKDIR /app

# Copy Gradle files
COPY build.gradle settings.gradle ./

# Download dependencies (cache layer)
RUN gradle dependencies --no-daemon

# Copy source code
COPY src ./src

# Build application
RUN gradle bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:17-jre-jammy

# Install curl for health checks
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create non-root user
RUN groupadd -r itda && useradd -r -g itda itda

# Copy JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Create asset directory and change ownership
RUN mkdir -p /app/asset && \
    chown -R itda:itda /app

# Switch to non-root user
USER itda

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/api/health || exit 1

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]