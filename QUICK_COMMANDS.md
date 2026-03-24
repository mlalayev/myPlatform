# ⚡ Quick Commands Cheat Sheet

Copy and paste these commands for your production deployment.

---

## 🚀 Nginx + HTTPS Setup (Complete)

### Step 1: Install Nginx
```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 2: Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/myplatform
```

**Paste this (replace `yourdomain.com` with your domain):**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Step 3: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/myplatform /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Install SSL (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Follow prompts:**
- Enter email
- Type `A` (agree)
- Type `N` (no sharing)
- Type `2` (redirect to HTTPS)

### Step 5: Configure Firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

### Step 6: Test
```bash
curl https://yourdomain.com
```

**Done! Access your site at `https://yourdomain.com` 🎉**

---

## 📦 Full Deployment (All Steps)

### System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl wget git build-essential software-properties-common ca-certificates gnupg lsb-release
```

### Docker
```bash
# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
```

### Node.js
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### PostgreSQL
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql << EOF
CREATE DATABASE mydb;
CREATE USER murad WITH ENCRYPTED PASSWORD 'SeninSehfre123!';
GRANT ALL PRIVILEGES ON DATABASE mydb TO murad;
\q
EOF
```

### Docker Images (All 8 Languages)
```bash
docker pull python:3.11
docker pull node:18
docker pull gcc:13
docker pull eclipse-temurin:17-jdk
docker pull php:8.2-cli
docker pull golang:1.21
docker pull rust:1.72
docker pull mcr.microsoft.com/dotnet/sdk:8.0
```

### Application Setup
```bash
# Clone/upload code
cd /var/www
sudo mkdir -p myplatform
sudo chown -R $USER:$USER myplatform
cd myplatform

# Configure .env
nano .env
```

**Paste in .env:**
```env
DATABASE_URL="postgresql://murad:SeninSehfre123!@localhost:5432/mydb?schema=public"
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=YOUR_32_CHAR_SECRET_HERE
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Generate secret:**
```bash
openssl rand -base64 32
```

### Build & Start
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Start code executor
docker compose up -d

# Start app
pm2 start npm --name myplatform -- start
pm2 save
pm2 startup
```

### Nginx + SSL (see above section)

---

## 🔍 Monitoring Commands

### Check Status
```bash
pm2 status                          # Application status
docker ps                           # Docker containers
sudo systemctl status nginx         # Nginx status
sudo systemctl status postgresql    # Database status
```

### View Logs
```bash
pm2 logs myplatform                 # App logs
pm2 logs myplatform --lines 100     # Last 100 lines
sudo tail -f /var/log/nginx/access.log    # Nginx access
sudo tail -f /var/log/nginx/error.log     # Nginx errors
docker logs code-executor           # Docker executor logs
```

### System Resources
```bash
htop                                # CPU/RAM usage
df -h                               # Disk space
free -h                             # Memory usage
docker stats                        # Docker resources
```

---

## 🔄 Restart Commands

### Restart Everything
```bash
pm2 restart myplatform
sudo systemctl restart nginx
sudo systemctl restart docker
docker compose restart
```

### Restart Individual Services
```bash
pm2 restart myplatform              # App only
sudo systemctl reload nginx         # Nginx (no downtime)
docker compose restart code-executor  # Executor only
```

---

## 🔧 Update Application

```bash
cd /var/www/myplatform
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart myplatform
sudo systemctl reload nginx
```

---

## 💾 Backup

### Manual Backup
```bash
# Backup database
sudo -u postgres pg_dump mydb > backup_$(date +%Y%m%d).sql

# Backup files
tar -czf backup_files_$(date +%Y%m%d).tar.gz /var/www/myplatform
```

### Automated Daily Backup (cron)
```bash
sudo crontab -e
```
Add:
```cron
0 2 * * * sudo -u postgres pg_dump mydb > /var/backups/myplatform/db_$(date +\%Y\%m\%d).sql
```

---

## 🐛 Troubleshooting

### App Not Working
```bash
pm2 logs myplatform --lines 50
pm2 describe myplatform
pm2 restart myplatform
```

### Nginx 502 Error
```bash
pm2 status                          # Check if app running
sudo systemctl status nginx         # Check Nginx
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Error
```bash
sudo systemctl status postgresql
psql -U murad -d mydb -h localhost
# Check DATABASE_URL in .env
```

### Port Already in Use
```bash
sudo lsof -i :3000                  # Check port 3000
sudo lsof -i :80                    # Check port 80
sudo kill -9 <PID>                  # Kill process if needed
```

### SSL Certificate Issues
```bash
sudo certbot certificates           # Check certificates
sudo certbot renew --dry-run        # Test renewal
sudo certbot --nginx -d yourdomain.com  # Re-run Certbot
```

---

## 🔥 Firewall

### Setup Firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 📊 Performance Testing

### Test Site Speed
```bash
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
```

Create `curl-format.txt`:
```bash
cat > curl-format.txt << 'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
      time_redirect:  %{time_redirect}\n
   time_pretransfer:  %{time_pretransfer}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF
```

---

## ✅ Health Check Script

Create `health-check.sh`:
```bash
#!/bin/bash

echo "=== System Health Check ==="
echo ""

echo "1. Application Status:"
pm2 status | grep myplatform

echo ""
echo "2. Docker Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"

echo ""
echo "3. Nginx Status:"
sudo systemctl status nginx --no-pager | grep Active

echo ""
echo "4. Database Status:"
sudo systemctl status postgresql --no-pager | grep Active

echo ""
echo "5. Disk Space:"
df -h | grep -E "Filesystem|/$"

echo ""
echo "6. Memory Usage:"
free -h | grep -E "Mem|Swap"

echo ""
echo "7. SSL Certificate Expiry:"
sudo certbot certificates 2>/dev/null | grep "Expiry Date"

echo ""
echo "=== Health Check Complete ==="
```

Run it:
```bash
chmod +x health-check.sh
./health-check.sh
```

---

## 🎯 Production Checklist

Before going live:

- [ ] All Docker images pulled
- [ ] Database created and configured
- [ ] .env file configured with secrets
- [ ] Application builds successfully
- [ ] PM2 running application
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] HTTPS working
- [ ] Firewall enabled
- [ ] Backups scheduled
- [ ] Health monitoring setup
- [ ] DNS pointing to server
- [ ] All 8 languages tested

---

**🚀 Your application is production-ready!**

Access at: `https://yourdomain.com`
