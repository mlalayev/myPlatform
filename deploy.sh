#!/bin/bash

###############################################################################
# Production Deployment Script for Code Learning Platform
# Ubuntu 22.04 LTS
#
# Usage: 
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# This script automates the initial server setup.
# You'll still need to configure .env file and other settings manually.
###############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Code Learning Platform - Production Deployment        ║"
echo "║                    Ubuntu 22.04 LTS                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}[1/15] Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${YELLOW}[2/15] Installing essential build tools...${NC}"
apt install -y curl wget git build-essential software-properties-common \
    ca-certificates gnupg lsb-release

echo -e "${YELLOW}[3/15] Installing Docker...${NC}"
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start Docker
systemctl start docker
systemctl enable docker

echo -e "${GREEN}✓ Docker installed successfully${NC}"

echo -e "${YELLOW}[4/15] Installing Node.js 20.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo -e "${GREEN}✓ Node.js $(node --version) installed${NC}"
echo -e "${GREEN}✓ npm $(npm --version) installed${NC}"

echo -e "${YELLOW}[5/15] Installing PM2 process manager...${NC}"
npm install -g pm2

echo -e "${YELLOW}[6/15] Installing PostgreSQL...${NC}"
apt install -y postgresql postgresql-contrib

# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

echo -e "${GREEN}✓ PostgreSQL installed successfully${NC}"

echo -e "${YELLOW}[7/15] Installing Nginx...${NC}"
apt install -y nginx
systemctl enable nginx

echo -e "${YELLOW}[8/15] Pulling Docker images for code execution...${NC}"
echo "This may take 10-15 minutes depending on your internet speed..."

docker pull python:3.11
echo -e "${GREEN}✓ Python image downloaded${NC}"

docker pull node:18
echo -e "${GREEN}✓ Node.js image downloaded${NC}"

docker pull gcc:13
echo -e "${GREEN}✓ GCC image downloaded${NC}"

docker pull eclipse-temurin:17-jdk
echo -e "${GREEN}✓ Java image downloaded${NC}"

docker pull php:8.2-cli
echo -e "${GREEN}✓ PHP image downloaded${NC}"

docker pull golang:1.21
echo -e "${GREEN}✓ Go image downloaded${NC}"

docker pull rust:1.72
echo -e "${GREEN}✓ Rust image downloaded${NC}"

docker pull mcr.microsoft.com/dotnet/sdk:8.0
echo -e "${GREEN}✓ .NET SDK image downloaded${NC}"

echo -e "${YELLOW}[9/15] Creating application directory...${NC}"
mkdir -p /var/www/myplatform
chown -R www-data:www-data /var/www/myplatform

echo -e "${YELLOW}[10/15] Creating backup directory...${NC}"
mkdir -p /var/backups/myplatform

echo -e "${YELLOW}[11/15] Installing Certbot for SSL...${NC}"
apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}[12/15] Installing fail2ban for security...${NC}"
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

echo -e "${YELLOW}[13/15] Configuring firewall...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
echo "y" | ufw enable

echo -e "${YELLOW}[14/15] Installing additional tools...${NC}"
apt install -y htop ncdu

echo -e "${YELLOW}[15/15] Cleaning up...${NC}"
apt autoremove -y
apt autoclean -y

echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           Server Setup Complete! ✓                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Setup PostgreSQL database:"
echo "   sudo -u postgres psql"
echo "   CREATE DATABASE myplatform;"
echo "   CREATE USER myplatform_user WITH ENCRYPTED PASSWORD 'your_password';"
echo "   GRANT ALL PRIVILEGES ON DATABASE myplatform TO myplatform_user;"
echo "   \q"
echo ""
echo "2. Clone your application code to /var/www/myplatform"
echo ""
echo "3. Create .env file with your configuration"
echo ""
echo "4. Install dependencies: cd /var/www/myplatform && npm install"
echo ""
echo "5. Setup database: npx prisma generate && npx prisma migrate deploy"
echo ""
echo "6. Build application: npm run build"
echo ""
echo "7. Start services:"
echo "   - Docker executor: docker compose up -d"
echo "   - Application: pm2 start npm --name myplatform -- start"
echo ""
echo "8. Configure Nginx with your domain"
echo ""
echo "9. Setup SSL: sudo certbot --nginx -d yourdomain.com"
echo ""
echo -e "${GREEN}For detailed instructions, see PRODUCTION_DEPLOYMENT.md${NC}"
echo ""

# Print system info
echo -e "${YELLOW}System Information:${NC}"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Docker: $(docker --version)"
echo "PostgreSQL: $(psql --version | head -1)"
echo "Nginx: $(nginx -v 2>&1)"
echo ""

echo -e "${GREEN}Installation complete! 🚀${NC}"
