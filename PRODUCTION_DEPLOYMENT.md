# 🚀 Production Deployment Guide - Ubuntu 22.04

Complete step-by-step guide to deploy your code learning platform to production.

---

## 📋 Prerequisites

- Fresh Ubuntu 22.04 VPS/Server
- Root or sudo access
- Domain name (optional but recommended)
- At least 4GB RAM, 2 CPU cores, 40GB storage

---

## 🔒 SECURITY: Sandbox Protection

Your application executes user code in **fully isolated Docker containers**. Users **CANNOT damage your server**.

### Security Layers:
1. ✅ **Docker isolation** - Each execution in separate container
2. ✅ **Network disabled** - No internet access (`--network none`)
3. ✅ **Resource limits** - Max 256MB RAM, 50% CPU, 50 processes
4. ✅ **Read-only filesystem** - Cannot modify system files
5. ✅ **Capabilities dropped** - No root privileges possible
6. ✅ **30-second timeout** - Infinite loops auto-killed
7. ✅ **Unique temp dirs** - Complete isolation between users
8. ✅ **Auto-cleanup** - Containers deleted after execution

**What malicious users CANNOT do:**
- ❌ Access your server filesystem
- ❌ Connect to your database
- ❌ Access other users' code
- ❌ Consume all resources
- ❌ Download malware (network disabled)
- ❌ Escalate privileges
- ❌ Run forever (timeout)

**See `SECURITY_DOCUMENTATION.md` for complete details.**

---

## 🚀 STEP 1: Update System & Install Basic Dependencies

### 1.1 Update system packages
```bash
sudo apt update && sudo apt upgrade -y
```
**What it does:** Updates package lists and upgrades all installed packages to latest versions.

### 1.2 Install essential build tools
```bash
sudo apt install -y curl wget git build-essential software-properties-common ca-certificates gnupg lsb-release
```
**What it does:** Installs basic tools needed for compilation and package management.

---

## 🐳 STEP 2: Install Docker & Docker Compose

### 2.1 Install Docker
```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
**What it does:** Installs Docker container runtime for code execution isolation.

### 2.2 Start Docker and enable on boot
```bash
sudo systemctl start docker
sudo systemctl enable docker
```
**What it does:** Starts Docker service and ensures it starts automatically on system reboot.

### 2.3 Add current user to docker group (optional, for non-root usage)
```bash
sudo usermod -aG docker $USER
```
**What it does:** Allows running Docker commands without sudo. **Note: Log out and log back in for this to take effect.**

### 2.4 Verify Docker installation
```bash
docker --version
docker compose version
```
**What it does:** Confirms Docker and Docker Compose are installed correctly.

---

## 📦 STEP 3: Install Node.js & NPM

### 3.1 Install Node.js 20.x (LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
**What it does:** Installs Node.js runtime and npm package manager.

### 3.2 Verify Node.js and npm installation
```bash
node --version
npm --version
```
**What it does:** Confirms Node.js and npm are installed correctly.

### 3.3 Install PM2 globally (Process Manager)
```bash
sudo npm install -g pm2
```
**What it does:** Installs PM2 to keep your Next.js application running in production.

---

## 🐘 STEP 4: Install PostgreSQL Database

### 4.1 Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
```
**What it does:** Installs PostgreSQL database server.

### 4.2 Start PostgreSQL and enable on boot
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```
**What it does:** Starts PostgreSQL and ensures it starts on boot.

### 4.3 Secure PostgreSQL and create database
```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run these commands:
CREATE DATABASE mydb;
CREATE USER murad WITH ENCRYPTED PASSWORD 'SeninSehfre123!';
GRANT ALL PRIVILEGES ON DATABASE mydb TO murad;
\q
```
**What it does:** Creates a database and user for your application.

**Note:** These are your existing database credentials from `.env` file.

### 4.4 Allow local connections (optional)
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```
Add this line before other rules:
```
local   mydb      murad                   md5
```
Then restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```
**What it does:** Allows password authentication for your database user.

---

## 🎨 STEP 5: Pull Docker Images for Code Execution

Your application supports 10 programming languages. Pre-pull all Docker images:

### 5.1 Python
```bash
docker pull python:3.11
```
**What it does:** Downloads Python 3.11 runtime for executing Python code.

### 5.2 Node.js (for TypeScript)
```bash
docker pull node:18
```
**What it does:** Downloads Node.js for executing JavaScript/TypeScript code.

### 5.3 C/C++ Compiler
```bash
docker pull gcc:13
```
**What it does:** Downloads GCC compiler for C and C++ code execution.

### 5.4 Java
```bash
docker pull eclipse-temurin:17-jdk
```
**What it does:** Downloads Eclipse Temurin (OpenJDK) for Java code execution.

**Note:** The official `openjdk` images were deprecated. We now use `eclipse-temurin` which is the official successor.

### 5.5 PHP
```bash
docker pull php:8.2-cli
```
**What it does:** Downloads PHP CLI for PHP code execution.

### 5.6 Go
```bash
docker pull golang:1.21
```
**What it does:** Downloads Go compiler for Go code execution.

### 5.7 Rust
```bash
docker pull rust:1.72
```
**What it does:** Downloads Rust compiler for Rust code execution.

### 5.8 .NET (for C#)
```bash
docker pull mcr.microsoft.com/dotnet/sdk:8.0
```
**What it does:** Downloads .NET SDK for C# code execution.

### 5.9 Verify all images are downloaded
```bash
docker images
```
**What it does:** Lists all downloaded Docker images.

---

## 📁 STEP 6: Clone Your Application

### 6.1 Clone from GitHub (or upload your code)
```bash
cd /var/www
sudo mkdir -p myplatform
sudo chown -R $USER:$USER myplatform
cd myplatform

# If using Git
git clone https://github.com/yourusername/yourrepo.git .

# Or upload your code via SCP/SFTP
```
**What it does:** Gets your application code on the server.

---

## ⚙️ STEP 7: Configure Environment Variables

### 7.1 Create .env file
```bash
cd /var/www/myplatform
nano .env
```

### 7.2 Add these environment variables
```env
# Database Configuration
DATABASE_URL="postgresql://murad:SeninSehfre123!@localhost:5432/mydb?schema=public"

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_super_long_random_secret_key_here_at_least_32_chars

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional: If you have external API keys
# OPENAI_API_KEY=your_key_here
```

**What it does:** Configures your application with production settings.

**⚠️ IMPORTANT:** 
- DATABASE_URL already has your credentials: `murad` user and `SeninSehfre123!` password
- Replace `your_super_long_random_secret_key_here` with a random 32+ character string
- Replace `yourdomain.com` with your actual domain (or use IP address for testing)

### 7.3 Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```
**What it does:** Generates a secure random secret for NextAuth. Copy the entire output line into `NEXTAUTH_SECRET` in your `.env` file (no spaces, no quotes unless your tooling requires them).

h6PSDMtQRJS8m6399tXQ8k8V5BMiSozDi5cV1mX/Pjw=

### 7.4 Finish `.env` for production
1. Open `.env`: `nano .env` (in your project folder).
2. Set `NEXTAUTH_SECRET=` to the value from step 7.3.
3. Set `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your real site URL (e.g. `https://yourdomain.com`). For a quick test before DNS/SSL, you can use `http://YOUR_SERVER_IP:3000` only temporarily; after Nginx + HTTPS they must be `https://yourdomain.com`.
4. Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X` in nano).

---

## 📦 STEP 8: Install Application Dependencies

### 8.1 Install npm packages
```bash
cd /var/www/myplatform
npm install
```
**What it does:** Installs all Node.js dependencies defined in package.json.

---

## 🗄️ STEP 9: Setup Database with Prisma

### 9.1 Generate Prisma Client
```bash
npx prisma generate
```
**What it does:** Generates Prisma Client for database operations.

### 9.2 Run database migrations
```bash
npx prisma migrate deploy
```
**What it does:** Creates all database tables and schema.

### 9.3 (Optional) Seed database with initial data
```bash
# If you have a seed script
npx prisma db seed
```
**What it does:** Populates database with initial data (tutorials, exercises, etc.).

---

## 🏗️ STEP 10: Build Next.js Application

### 10.1 Build for production
```bash
cd /var/www/myplatform
npm run build
```
**What it does:** Compiles Next.js application for production with optimizations.

**This may take 2-5 minutes depending on server specs.**

---

## 🐳 STEP 11: Start Code Executor Container

### 11.1 Build and start the executor
```bash
cd /var/www/myplatform
docker compose up code-executor -d
```
**What it does:** Starts the Docker container that executes user code safely.

### 11.2 Verify executor is running
```bash
docker ps
```
**What it does:** Shows running containers. You should see `code-executor`.

---

## 🚀 STEP 12: Start Application with PM2

### 12.1 Start Next.js with PM2
```bash
cd /var/www/myplatform
pm2 start npm --name "myplatform" -- start
```
**What it does:** Starts your Next.js application and keeps it running.

### 12.2 Save PM2 configuration
```bash
pm2 save
```
**What it does:** Saves current PM2 process list.

### 12.3 Setup PM2 to start on boot
```bash
pm2 startup
```
**What it does:** Generates startup script. **Follow the command it outputs!**

### 12.4 Verify application is running
```bash
pm2 status
```
**What it does:** Shows status of all PM2 processes.

### 12.5 View application logs
```bash
pm2 logs myplatform
```
**What it does:** Shows real-time logs of your application.

---

## 🌐 STEP 13: Setup Nginx Reverse Proxy

**For complete detailed guide, see `NGINX_HTTPS_SETUP.md`**

### 13.1 Install Nginx
```bash
sudo apt install -y nginx
```
**What it does:** Installs Nginx web server to proxy requests to your Next.js app.

### 13.2 Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/myplatform
```

### 13.3 Add this configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Max upload size (for user code)
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
        
        # Timeouts for code execution
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```
**What it does:** Configures Nginx to forward requests to your Next.js app.

**⚠️ Replace `yourdomain.com` with your actual domain!**

### 13.4 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/myplatform /etc/nginx/sites-enabled/
```
**What it does:** Activates your Nginx configuration.

### 13.5 Test Nginx configuration
```bash
sudo nginx -t
```
**What it does:** Checks if configuration has no syntax errors.

### 13.6 Restart Nginx
```bash
sudo systemctl restart nginx
```
**What it does:** Applies the new configuration.

---

## 🔒 STEP 14: Setup SSL with Let's Encrypt (HTTPS)

**For complete detailed guide, see `NGINX_HTTPS_SETUP.md`**

### 14.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```
**What it does:** Installs SSL certificate manager.

### 14.2 Obtain SSL certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
**What it does:** Gets free SSL certificate and configures Nginx automatically.

**Follow the prompts:**
- Enter your email
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommended: Yes)

### 14.3 Test SSL auto-renewal
```bash
sudo certbot renew --dry-run
```
**What it does:** Tests automatic certificate renewal.

---

## 🔥 STEP 15: Configure Firewall

### 15.1 Enable UFW firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```
**What it does:** Enables firewall and allows SSH + HTTP/HTTPS traffic.

### 15.2 Check firewall status
```bash
sudo ufw status
```
**What it does:** Shows firewall rules.

---

## 🔍 STEP 16: Verify Everything Works

### 16.1 Check if application is responding
```bash
curl http://localhost:3000
```
**What it does:** Tests if Next.js app responds on port 3000.

### 16.2 Check through Nginx
```bash
curl http://yourdomain.com
```
**What it does:** Tests if Nginx correctly proxies to your app.

### 16.3 Test HTTPS
```bash
curl https://yourdomain.com
```
**What it does:** Verifies SSL is working.

### 16.4 Test code execution (Python example)
Open your browser and go to: `https://yourdomain.com/az/tutorials`

Try running this Python code:
```python
def hello():
    return "Hello, Production!"

print(hello())
```

**Expected output:** `Hello, Production!`

---

## 📊 STEP 17: Setup Monitoring & Maintenance

### 17.1 Monitor PM2 processes
```bash
pm2 monit
```
**What it does:** Shows real-time monitoring dashboard.

### 17.2 View application logs
```bash
# PM2 logs
pm2 logs myplatform --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```
**What it does:** Shows various system logs.

### 17.3 Restart application
```bash
pm2 restart myplatform
```
**What it does:** Restarts your Next.js application.

### 17.4 Check disk space
```bash
df -h
```
**What it does:** Shows disk usage.

### 17.5 Check Docker container status
```bash
docker ps
docker logs <container_id>
```
**What it does:** Shows Docker container status and logs.

---

## 🗑️ STEP 18: Cleanup & Optimization

### 18.1 Remove unused Docker images
```bash
docker system prune -a
```
**What it does:** Removes unused Docker images and containers to free space.

### 18.2 Setup log rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```
**What it does:** Automatically rotates logs to prevent disk filling.

---

## 🔄 STEP 19: Updating Your Application

When you need to deploy updates:

```bash
# 1. Navigate to app directory
cd /var/www/myplatform

# 2. Pull latest code
git pull origin main

# 3. Install new dependencies (if any)
npm install

# 4. Run new migrations (if any)
npx prisma migrate deploy
npx prisma generate

# 5. Rebuild application
npm run build

# 6. Restart application
pm2 restart myplatform

# 7. Clear Nginx cache (if needed)
sudo systemctl reload nginx
```

---

## 📝 STEP 20: Backup Strategy

### 20.1 Backup database
```bash
# Create backup directory
sudo mkdir -p /var/backups/myplatform

# Backup database
sudo -u postgres pg_dump myplatform > /var/backups/myplatform/db_backup_$(date +%Y%m%d_%H%M%S).sql
```
**What it does:** Creates database backup with timestamp.

### 20.2 Setup automated daily backups
```bash
sudo crontab -e
```
Add this line:
```cron
0 2 * * * sudo -u postgres pg_dump myplatform > /var/backups/myplatform/db_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```
**What it does:** Automatically backs up database daily at 2 AM.

### 20.3 Backup uploaded files (if any)
```bash
tar -czf /var/backups/myplatform/files_backup_$(date +%Y%m%d).tar.gz /var/www/myplatform/public/uploads
```
**What it does:** Creates compressed backup of uploaded files.

---

## ⚠️ Troubleshooting

### Application not starting
```bash
# Check logs
pm2 logs myplatform --lines 50

# Check Node.js errors
pm2 describe myplatform
```

### Database connection errors
```bash
# Test PostgreSQL connection
psql -U myplatform_user -d myplatform -h localhost

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Docker errors
```bash
# Restart Docker
sudo systemctl restart docker

# Check Docker logs
docker logs code-executor
```

### Nginx errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 already in use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process (if needed)
sudo kill -9 <PID>
```

---

## 🎉 Deployment Complete!

Your application should now be running at:
- **HTTP:** http://yourdomain.com
- **HTTPS:** https://yourdomain.com

### Quick Status Check Commands
```bash
# Application status
pm2 status

# Docker containers
docker ps

# Nginx status
sudo systemctl status nginx

# PostgreSQL status
sudo systemctl status postgresql

# Disk space
df -h

# Memory usage
free -h

# System resources
htop
```

---

## 📞 Support & Maintenance

### Useful PM2 Commands
```bash
pm2 status                    # Show all processes
pm2 logs                      # Show all logs
pm2 logs myplatform           # Show app logs
pm2 restart myplatform        # Restart app
pm2 stop myplatform           # Stop app
pm2 delete myplatform         # Remove from PM2
pm2 monit                     # Monitor dashboard
```

### Docker Commands
```bash
docker ps                     # Show running containers
docker ps -a                  # Show all containers
docker images                 # Show all images
docker logs <container>       # Show container logs
docker restart <container>    # Restart container
docker stop <container>       # Stop container
```

---

## 🔐 Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Change default SSH port** (optional but recommended)

3. **Setup fail2ban** to prevent brute force attacks:
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

4. **Regularly backup your database**

5. **Monitor system resources**

6. **Keep Docker images updated:**
   ```bash
   docker pull python:3.11
   docker pull node:18
   # ... etc for all images
   ```

---

## 🎯 Performance Optimization

### Enable gzip compression in Nginx
Edit `/etc/nginx/nginx.conf` and add:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### Increase Node.js memory limit (if needed)
```bash
pm2 delete myplatform
pm2 start npm --name "myplatform" --node-args="--max-old-space-size=4096" -- start
pm2 save
```

---

**Congratulations! Your application is now live in production! 🚀**

For any issues, check the troubleshooting section or review logs.
