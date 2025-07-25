# 🚀 Deployment Guide

## 📋 Prerequisites

- Docker and Docker Compose installed on your server
- Domain name pointing to your server
- SSL certificate (recommended)

## 🛠️ Deployment Steps

### 1. **Prepare Your Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. **Upload Your Code**

```bash
# Clone or upload your project to the server
git clone your-repository-url
cd myPlatform
```

### 3. **Configure Environment Variables**

Create `.env.production` file:
```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here

# Database Configuration
DATABASE_URL="postgresql://postgres:password@db:5432/myplatform"

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. **Update Docker Compose**

Update `docker-compose.yml` with your domain:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=your-nextauth-secret-here
    volumes:
      - ./prisma:/app/prisma
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your-secure-password
      - POSTGRES_DB=myplatform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### 5. **Deploy with Docker**

```bash
# Build and start the application
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Run database migrations
docker-compose exec app npx prisma migrate deploy
```

### 6. **Set Up Reverse Proxy (Nginx)**

Create `/etc/nginx/sites-available/myplatform`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
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
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/myplatform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. **Set Up SSL (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## ✅ **What Works After Deployment**

- ✅ **All 16 programming languages** supported
- ✅ **Code execution** works on any server
- ✅ **User authentication** with NextAuth
- ✅ **Database** with PostgreSQL
- ✅ **SSL/HTTPS** security
- ✅ **Auto-restart** on server reboot

## 🔧 **Maintenance Commands**

```bash
# Update application
git pull
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Backup database
docker-compose exec db pg_dump -U postgres myplatform > backup.sql

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

## 🎯 **Features Available**

### **Programming Languages:**
- JavaScript, TypeScript
- Python, Python3
- PHP, Ruby
- C++, C, C#
- Java, Kotlin, Scala
- Go, Rust
- Swift, Dart

### **Code Execution:**
- ✅ Real compilation and execution
- ✅ Error handling and output
- ✅ Security with timeouts
- ✅ Automatic cleanup

### **User Features:**
- ✅ Authentication system
- ✅ Tutorials and exercises
- ✅ Code editor with syntax highlighting
- ✅ Multi-language support

## 🚨 **Security Notes**

- Change default passwords in production
- Use strong NEXTAUTH_SECRET
- Regularly update Docker images
- Monitor server logs
- Set up automated backups

Your application is now ready for production deployment! 🚀 

## Docker konteynerində Python və digər dillər üçün düzgün kod icrası

Python (və digər dillər) üçün kodun konteynerdə problemsiz icra olunması üçün, əsas app konteynerini run edəndə hostun `/tmp` qovluğunu mount etmək lazımdır:

```
docker run -v /tmp:/tmp ... myplatform-app
```

Beləliklə, app konteynerində yaradılan `/tmp/sandbox_xxx` qovluğu real hostda da mövcud olacaq və Python konteyneri onu həmişə görəcək.

Docker Compose istifadə edirsənsə, `docker-compose.yml` faylında belə əlavə et:

```yaml
services:
  myplatform-app:
    image: myplatform-app:latest
    volumes:
      - /tmp:/tmp
    # ... digər ayarlar ...
```

Bu addım olmadan Python kodları "can't open file '/code/main.py'" xətası verə bilər. 