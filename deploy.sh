#!/bin/bash

# 🚀 MyPlatform Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting MyPlatform deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_warning ".env.production not found. Creating template..."
    cat > .env.production << EOF
# Production Environment Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here
DATABASE_URL="postgresql://postgres:password@db:5432/myplatform"
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
EOF
    print_warning "Please edit .env.production with your actual values before continuing."
    exit 1
fi

print_status "Building and starting containers..."
docker-compose up -d --build

print_status "Waiting for database to be ready..."
sleep 10

print_status "Running database migrations..."
docker-compose exec -T app npx prisma migrate deploy

print_status "Checking application health..."
sleep 5

# Check if the application is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
    print_status "🌐 Your application is available at: http://localhost:3000"
    print_status "📝 Check logs with: docker-compose logs -f"
else
    print_error "❌ Application failed to start. Check logs with: docker-compose logs -f"
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "🔧 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Update: git pull && docker-compose up -d --build" 

print_status "Warming up backend language Docker images..."
docker-compose exec -T app node scripts/warmupRunners.js || print_warning "Warm-up script failed, but deployment succeeded."
print_status "Warm-up completed! Users will not wait for image pulls on first run." 

# develop:
#   watch:
#     - action: sync
#       path: ./src
#       target: /app/src
#       ignore:
#         - node_modules/
#     - action: rebuild
#       path: package.json 