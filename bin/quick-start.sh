#!/bin/bash

# ITDA 빠른 시작 스크립트 (문제 해결용)
# DB만 먼저 시작하여 기본 환경 확인

set -euo pipefail

echo "🚀 ITDA 빠른 시작 (DB 우선 테스트)"
echo "========================================"

# 현재 디렉토리 확인
if [[ ! -f "docker-compose.yml" ]]; then
  echo "❌ docker-compose.yml 파일을 찾을 수 없습니다."
  echo "프로젝트 루트 디렉토리에서 실행해주세요."
  exit 1
fi

# 기존 컨테이너 정리 (옵션)
read -p "기존 컨테이너를 정리하시겠습니까? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🧹 기존 컨테이너 정리 중..."
  docker-compose down -v 2>/dev/null || true
  docker system prune -f 2>/dev/null || true
fi

# 1단계: DB만 시작
echo ""
echo "🔵 1단계: 데이터베이스만 시작"
echo "----------------------------------------"
echo "MySQL과 Redis 컨테이너만 시작합니다..."

docker-compose up -d itda-mysql itda-redis

echo "⏳ DB 컨테이너 시작 대기 중... (30초)"
sleep 30

# DB 상태 확인
echo "🔍 데이터베이스 연결 테스트..."

# MySQL 테스트
echo -n "  MySQL: "
if docker exec itda-mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  echo "MySQL 로그:"
  docker logs itda-mysql --tail 20
  exit 1
fi

# Redis 테스트
echo -n "  Redis: "
if docker exec itda-redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  echo "Redis 로그:"
  docker logs itda-redis --tail 20
  exit 1
fi

echo ""
echo "📊 실행 중인 컨테이너:"
docker ps --filter 'name=itda-' --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🎉 데이터베이스 시작 성공!"
echo "========================================"
echo ""
echo "🔗 DB 접속 정보:"
echo "   MySQL: localhost:13306 (idolphins2020/idolphinspass)"
echo "   Redis: localhost:16379"
echo ""
echo "💡 다음 단계:"
echo "   Backend 시작: ./bin/back-start.sh"
echo "   또는 전체 시작: ./bin/start-all.sh"
echo "   전체 중지: ./bin/stop-all.sh"