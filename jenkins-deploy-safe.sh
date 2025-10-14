#!/bin/bash
set -e

echo "Starting safe deployment..."
cd $WORKSPACE

# Docker 빌드 시 호스트 경로의 컨텍스트 사용
docker build -t output_sample_itda-backend:latest $WORKSPACE/back
docker build -t output_sample_itda-frontend:latest $WORKSPACE/front

# docker-compose로 서비스 재시작 (프로젝트 이름 명시하여 같은 네트워크 사용)
docker-compose -p output_sample up -d --force-recreate --no-deps itda-backend itda-frontend itda-web

# 헬스체크 대기
echo "Waiting for services to be healthy..."
sleep 30

# 상태 확인
docker-compose -p output_sample ps

# 정리
echo "Cleaning up unused images..."
docker image prune -f

echo "Deployment completed!"
