#!/bin/bash

# ITDA Docker 통합 관리 스크립트
# Docker 환경에서 모든 서비스를 관리하는 단일 스크립트

set -euo pipefail

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 도움말 표시
show_help() {
  cat << EOF
🐳 ITDA Docker 통합 관리 스크립트

사용법:
  ./bin/manage.sh <command> [service] [options]

명령어:
  start [service]     서비스 시작 (빌드 포함)
  stop [service]      서비스 중지
  restart [service]   서비스 재시작
  status              전체 상태 확인
  logs [service]      로그 확인 (실시간)
  build [service]     이미지 빌드
  clean               모든 컨테이너 및 볼륨 제거

서비스:
  all                 모든 서비스 (기본값)
  db                  MySQL + Redis
  backend             Spring Boot API
  frontend            React + Vite
  web                 Nginx
  jenkins             Jenkins CI/CD

옵션:
  --no-build          빌드 없이 시작
  --remove-volumes    중지 시 볼륨도 제거
  --remove-images     중지 시 이미지도 제거

예제:
  ./bin/manage.sh start                    # 모든 서비스 시작
  ./bin/manage.sh start db                 # DB만 시작
  ./bin/manage.sh stop all --remove-volumes # 모든 서비스 중지 및 볼륨 제거
  ./bin/manage.sh restart backend          # Backend 재시작
  ./bin/manage.sh logs frontend            # Frontend 로그 확인
  ./bin/manage.sh status                   # 전체 상태 확인

EOF
}

# docker-compose.yml 확인
check_docker_compose() {
  if [[ ! -f "docker-compose.yml" ]]; then
    echo -e "${RED}❌ docker-compose.yml 파일을 찾을 수 없습니다.${NC}"
    echo "프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
  fi
}

# 포트 충돌 확인
check_port_conflicts() {
  local ports=(180 15173 18080 13306 16379 9080 50000)
  local conflicts=()

  for port in "${ports[@]}"; do
    if lsof -i :$port >/dev/null 2>&1; then
      conflicts+=($port)
    fi
  done

  if [ ${#conflicts[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  포트 충돌이 감지되었습니다: ${conflicts[*]}${NC}"
    read -p "계속 진행하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      exit 1
    fi
  fi
}

# 서비스명 변환 (사용자 입력 -> docker-compose 서비스명)
get_service_names() {
  local service=$1
  case $service in
    all)
      echo ""
      ;;
    db)
      echo "itda-mysql itda-redis"
      ;;
    backend)
      echo "itda-backend"
      ;;
    frontend)
      echo "itda-frontend"
      ;;
    web)
      echo "itda-web"
      ;;
    jenkins)
      echo "itda-jenkins"
      ;;
    *)
      echo -e "${RED}❌ 잘못된 서비스명: $service${NC}"
      echo "사용 가능한 서비스: all, db, backend, frontend, web, jenkins"
      exit 1
      ;;
  esac
}

# 의존성 확인
check_dependencies() {
  local service=$1

  case $service in
    backend)
      if ! docker ps --filter 'name=itda-mysql' --filter 'status=running' | grep -q itda-mysql; then
        echo -e "${RED}❌ MySQL이 실행되지 않았습니다. DB를 먼저 시작해주세요.${NC}"
        echo "실행 명령: ./bin/manage.sh start db"
        exit 1
      fi
      if ! docker ps --filter 'name=itda-redis' --filter 'status=running' | grep -q itda-redis; then
        echo -e "${RED}❌ Redis가 실행되지 않았습니다. DB를 먼저 시작해주세요.${NC}"
        echo "실행 명령: ./bin/manage.sh start db"
        exit 1
      fi
      ;;
    frontend)
      if ! docker ps --filter 'name=itda-backend' --filter 'status=running' | grep -q itda-backend; then
        echo -e "${YELLOW}⚠️  Backend가 실행되지 않았습니다.${NC}"
        echo "Frontend는 Backend 없이도 실행 가능하지만, API 호출이 실패할 수 있습니다."
        read -p "계속 진행하시겠습니까? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
          exit 1
        fi
      fi
      ;;
    web)
      if ! docker ps --filter 'name=itda-frontend' --filter 'status=running' | grep -q itda-frontend; then
        echo -e "${YELLOW}⚠️  Frontend가 실행되지 않았습니다.${NC}"
      fi
      if ! docker ps --filter 'name=itda-backend' --filter 'status=running' | grep -q itda-backend; then
        echo -e "${YELLOW}⚠️  Backend가 실행되지 않았습니다.${NC}"
      fi
      ;;
  esac
}

# 헬스 체크
health_check() {
  local service=$1

  case $service in
    db)
      echo -e "${BLUE}🔍 DB 헬스 체크...${NC}"
      # MySQL
      echo -n "  MySQL: "
      for i in {1..30}; do
        if docker exec itda-mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
          echo -e "${GREEN}✅ OK${NC}"
          break
        fi
        if [ $i -eq 30 ]; then
          echo -e "${RED}❌ FAILED${NC}"
        fi
        sleep 2
      done

      # Redis
      echo -n "  Redis: "
      if docker exec itda-redis redis-cli ping 2>/dev/null | grep -q "PONG"; then
        echo -e "${GREEN}✅ OK${NC}"
      else
        echo -e "${RED}❌ FAILED${NC}"
      fi
      ;;

    backend)
      echo -e "${BLUE}🔍 Backend 헬스 체크...${NC}"
      echo -n "  Backend API: "
      for i in {1..30}; do
        if curl -f http://localhost:18080/api/health >/dev/null 2>&1; then
          echo -e "${GREEN}✅ OK${NC}"
          break
        fi
        if [ $i -eq 30 ]; then
          echo -e "${RED}❌ FAILED${NC}"
        fi
        sleep 3
      done
      ;;

    frontend)
      echo -e "${BLUE}🔍 Frontend 헬스 체크...${NC}"
      echo -n "  Frontend: "
      for i in {1..30}; do
        if curl -f http://localhost:15173 >/dev/null 2>&1; then
          echo -e "${GREEN}✅ OK${NC}"
          break
        fi
        if [ $i -eq 30 ]; then
          echo -e "${RED}❌ FAILED${NC}"
        fi
        sleep 2
      done
      ;;

    web)
      echo -e "${BLUE}🔍 Web Server 헬스 체크...${NC}"
      echo -n "  Nginx: "
      for i in {1..15}; do
        if curl -f http://localhost:180 >/dev/null 2>&1; then
          echo -e "${GREEN}✅ OK${NC}"
          break
        fi
        if [ $i -eq 15 ]; then
          echo -e "${RED}❌ FAILED${NC}"
        fi
        sleep 2
      done
      ;;

    jenkins)
      echo -e "${BLUE}🔍 Jenkins 헬스 체크...${NC}"
      echo -n "  Jenkins: "
      for i in {1..40}; do
        if curl -f http://localhost:9080/login >/dev/null 2>&1; then
          echo -e "${GREEN}✅ OK${NC}"
          break
        fi
        if [ $i -eq 40 ]; then
          echo -e "${RED}❌ FAILED${NC}"
        fi
        sleep 3
      done
      ;;
  esac
}

# 서비스 시작
start_service() {
  local service=${1:-all}
  local no_build=${2:-false}

  check_docker_compose
  check_port_conflicts

  local services=$(get_service_names $service)

  echo -e "${BLUE}🚀 ITDA 서비스 시작${NC}"
  echo "========================================"

  if [ "$service" != "all" ]; then
    check_dependencies $service
  fi

  if [ "$no_build" = true ]; then
    echo -e "${BLUE}🔵 서비스 시작 (빌드 제외)...${NC}"
    docker-compose up -d $services
  else
    echo -e "${BLUE}🔵 서비스 빌드 및 시작...${NC}"
    docker-compose up -d --build $services
  fi

  echo -e "${YELLOW}⏳ 서비스 시작 대기 중...${NC}"

  # 서비스별 대기 시간
  case $service in
    db)
      sleep 10
      health_check db
      ;;
    backend)
      sleep 20
      health_check backend
      ;;
    frontend)
      sleep 15
      health_check frontend
      ;;
    web)
      sleep 5
      health_check web
      ;;
    jenkins)
      sleep 20
      health_check jenkins
      ;;
    all)
      sleep 30
      health_check db
      health_check backend
      health_check frontend
      health_check web
      health_check jenkins
      ;;
  esac

  echo ""
  echo -e "${GREEN}🎉 서비스 시작 완료!${NC}"
  show_status
  show_access_info
}

# 서비스 중지
stop_service() {
  local service=${1:-all}
  local remove_volumes=${2:-false}
  local remove_images=${3:-false}

  check_docker_compose

  local services=$(get_service_names $service)

  echo -e "${RED}🛑 ITDA 서비스 중지${NC}"
  echo "========================================"

  echo "📊 현재 실행 중인 서비스:"
  docker-compose ps

  echo ""
  echo -e "${RED}🔴 서비스 중지 중...${NC}"
  docker-compose stop $services

  echo ""
  echo -e "${GREEN}✅ 서비스가 중지되었습니다.${NC}"

  # 볼륨 제거
  if [ "$remove_volumes" = true ]; then
    echo ""
    read -p "데이터베이스 볼륨도 제거하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}🗑️  볼륨 제거 중...${NC}"
      docker-compose down -v $services
      echo -e "${GREEN}✅ 볼륨이 제거되었습니다.${NC}"
    fi
  fi

  # 이미지 제거
  if [ "$remove_images" = true ]; then
    echo ""
    read -p "빌드된 이미지도 제거하시겠습니까? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${YELLOW}🗑️  이미지 제거 중...${NC}"
      docker-compose down --rmi local $services
      echo -e "${GREEN}✅ 이미지가 제거되었습니다.${NC}"
    fi
  fi

  echo ""
  echo -e "${GREEN}🎉 서비스 중지 완료!${NC}"
}

# 서비스 재시작
restart_service() {
  local service=${1:-all}

  echo -e "${YELLOW}🔄 서비스 재시작${NC}"
  echo "========================================"

  stop_service $service false false
  echo ""
  sleep 2
  start_service $service false
}

# 상태 확인
show_status() {
  check_docker_compose

  echo ""
  echo -e "${BLUE}📊 ITDA 컨테이너 상태${NC}"
  echo "========================================"
  docker ps --filter 'name=itda-' --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || true

  echo ""
  echo -e "${BLUE}💾 볼륨 상태${NC}"
  echo "========================================"
  docker volume ls --filter 'name=output_sample' || true

  echo ""
  echo -e "${BLUE}📈 리소스 사용량${NC}"
  echo "========================================"
  docker stats --no-stream --filter 'name=itda-' || true
}

# 로그 확인
show_logs() {
  local service=${1:-}

  check_docker_compose

  if [ -z "$service" ]; then
    echo -e "${BLUE}📋 전체 서비스 로그 (실시간)${NC}"
    docker-compose logs -f
  else
    local services=$(get_service_names $service)
    echo -e "${BLUE}📋 $service 로그 (실시간)${NC}"
    docker-compose logs -f $services
  fi
}

# 빌드
build_service() {
  local service=${1:-all}

  check_docker_compose

  local services=$(get_service_names $service)

  echo -e "${BLUE}🔨 이미지 빌드${NC}"
  echo "========================================"

  docker-compose build $services

  echo ""
  echo -e "${GREEN}✅ 빌드 완료!${NC}"
}

# 완전 삭제
clean_all() {
  check_docker_compose

  echo -e "${RED}⚠️  주의: 모든 컨테이너, 볼륨, 이미지가 제거됩니다!${NC}"
  read -p "정말로 모든 것을 제거하시겠습니까? (y/N): " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 0
  fi

  echo -e "${RED}🗑️  모든 리소스 제거 중...${NC}"
  docker-compose down -v --rmi all

  echo ""
  echo -e "${GREEN}✅ 모든 리소스가 제거되었습니다.${NC}"
}

# 접속 정보 표시
show_access_info() {
  echo ""
  echo -e "${GREEN}🌐 접속 정보${NC}"
  echo "========================================"
  echo "📱 메인 사이트: http://localhost:180"
  echo "🔗 API 서버: http://localhost:180/api"
  echo "⚡ Frontend: http://localhost:15173"
  echo "💾 Backend API: http://localhost:18080/api"
  echo "🗄️  MySQL: localhost:13306"
  echo "🔄 Redis: localhost:16379"
  echo "🔧 Jenkins: http://localhost:9080"
  echo ""
  echo -e "${BLUE}💡 유용한 명령어${NC}"
  echo "========================================"
  echo "상태 확인: ./bin/manage.sh status"
  echo "로그 확인: ./bin/manage.sh logs [service]"
  echo "서비스 중지: ./bin/manage.sh stop [service]"
  echo "서비스 재시작: ./bin/manage.sh restart [service]"
}

# 메인 로직
main() {
  local command=${1:-}
  local service=${2:-all}
  local option1=${3:-}
  local option2=${4:-}

  # 옵션 파싱
  local no_build=false
  local remove_volumes=false
  local remove_images=false

  for arg in "$@"; do
    case $arg in
      --no-build)
        no_build=true
        ;;
      --remove-volumes)
        remove_volumes=true
        ;;
      --remove-images)
        remove_images=true
        ;;
    esac
  done

  case $command in
    start)
      start_service $service $no_build
      ;;
    stop)
      stop_service $service $remove_volumes $remove_images
      ;;
    restart)
      restart_service $service
      ;;
    status)
      show_status
      ;;
    logs)
      show_logs $service
      ;;
    build)
      build_service $service
      ;;
    clean)
      clean_all
      ;;
    help|--help|-h)
      show_help
      ;;
    *)
      echo -e "${RED}❌ 잘못된 명령어: $command${NC}"
      echo ""
      show_help
      exit 1
      ;;
  esac
}

# 스크립트 실행
main "$@"
