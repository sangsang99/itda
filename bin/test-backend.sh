#!/bin/bash

# ITDA Backend 테스트 스크립트

echo "🔍 ITDA Backend API 테스트"
echo "================================"

echo "1. Health Check API 테스트..."
HEALTH_RESPONSE=$(curl -s http://localhost:18080/api/health)
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q '"status":"UP"'; then
  echo "✅ Backend Health Check 성공"
else
  echo "❌ Backend Health Check 실패"
  exit 1
fi

echo ""
echo "2. Actuator Health 테스트..."
ACTUATOR_RESPONSE=$(curl -s http://localhost:18080/actuator/health)
echo "Response: $ACTUATOR_RESPONSE"

if echo "$ACTUATOR_RESPONSE" | grep -q '"status":"UP"'; then
  echo "✅ Actuator Health Check 성공"
else
  echo "❌ Actuator Health Check 실패"
fi

echo ""
echo "🎉 Backend API 테스트 완료!"