#!/bin/bash

# MyPlatform Deployment Script
# Bu skript production mühitində platformanı deploy edir

set -e  # Error olarsa dayan

echo "🚀 MyPlatform Production Deployment başlayır..."

# Environment variables yoxla
if [ ! -f .env ]; then
    echo "❌ .env faylı tapılmadı!"
    echo "Zəhmət olmasa .env.example faylını kopyalayın və konfiqurasiya edin"
    exit 1
fi

# Docker yoxla
if ! command -v docker &> /dev/null; then
    echo "❌ Docker quraşdırılmayıb!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose quraşdırılmayıb!"
    exit 1
fi

echo "✅ Docker və Docker Compose tapıldı"

# Köhnə container-ləri dayandır
echo "🛑 Köhnə servisləri dayandırır..."
docker-compose -f docker-compose.prod.yml down --remove-orphans

# Yeni image-ləri build et
echo "🔨 Production image-ləri build edilir..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Servisləri başlat
echo "🚀 Production servisləri başladılır..."
docker-compose -f docker-compose.prod.yml up -d

# Verilənlər bazası migration-larını işə sal
echo "🗄️ Verilənlər bazası migration-ları işə salınır..."
docker-compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

# Health check
echo "🏥 Health check edilir..."
sleep 10

# Servislərin statusunu yoxla
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Bütün servislər uğurla işləyir!"
    echo "🌐 Platforma http://localhost:3000 ünvanında əlçatandır"
else
    echo "❌ Bəzi servislər işləmir!"
    echo "Logları yoxlayın: docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "🎉 Deployment uğurla tamamlandı!"
echo ""
echo "📋 Faydalı əmrlər:"
echo "  - Logları gör: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Servisləri dayandır: docker-compose -f docker-compose.prod.yml down"
echo "  - Yenidən başlat: docker-compose -f docker-compose.prod.yml restart" 