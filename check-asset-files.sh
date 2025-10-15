#!/bin/bash

echo "==================================="
echo "컨테이너 내 물리파일 확인 스크립트"
echo "==================================="
echo ""

# 1. 디렉토리 구조 확인
echo "📁 디렉토리 구조:"
docker exec itda-backend ls -la /app/asset

echo ""
echo "📁 content 디렉토리:"
docker exec itda-backend ls -lh /app/asset/content

echo ""
echo "📁 thumbnail 디렉토리:"
docker exec itda-backend ls -lh /app/asset/thumbnail

echo ""
echo "==================================="
echo ""

# 2. 파일 개수 및 용량 확인
echo "📊 파일 통계:"
echo "  - content 파일 수: $(docker exec itda-backend sh -c 'find /app/asset/content -type f 2>/dev/null | wc -l')"
echo "  - thumbnail 파일 수: $(docker exec itda-backend sh -c 'find /app/asset/thumbnail -type f 2>/dev/null | wc -l')"
echo "  - 전체 용량: $(docker exec itda-backend du -sh /app/asset 2>/dev/null | awk '{print $1}')"

echo ""
echo "==================================="
echo ""

# 3. 특정 파일 검색 (선택적)
# docker exec itda-backend find /app/asset -name "*.jpg"

# 4. 컨테이너 접속 명령어 안내
echo "💡 직접 확인하려면:"
echo "   docker exec -it itda-backend /bin/bash"
echo ""
echo "💡 특정 파일 보기:"
echo "   docker exec itda-backend cat /app/asset/content/파일명"
echo ""
echo "💡 파일을 호스트로 복사:"
echo "   docker cp itda-backend:/app/asset/content ./backup-content"
