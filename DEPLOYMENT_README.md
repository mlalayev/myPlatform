# 📦 Deployment Files Overview

This directory contains everything you need to deploy your code learning platform to production.

---

## 📄 Files in this Package

### 1. **PRODUCTION_DEPLOYMENT.md** (Main Guide)
- **Purpose:** Complete step-by-step deployment guide
- **Content:** 20 detailed steps covering everything from server setup to monitoring
- **Usage:** Follow this for your first deployment
- **Who:** For system administrators or developers deploying to production

### 2. **DEPLOYMENT_CHECKLIST.md** (Verification)
- **Purpose:** Ensure you don't miss any steps
- **Content:** Checkboxes for each deployment task
- **Usage:** Check off items as you complete them
- **Who:** Perfect for tracking deployment progress

### 3. **deploy.sh** (Automation Script)
- **Purpose:** Automates initial server setup
- **Content:** Bash script that installs all required software
- **Usage:** `chmod +x deploy.sh && sudo ./deploy.sh`
- **Who:** Speeds up installation of base requirements
- **⚠️ Note:** Still need to configure .env and app-specific settings manually

---

## 🚀 Quick Start (3 Options)

### Option 1: Fully Manual (Recommended for Learning)
1. Read `PRODUCTION_DEPLOYMENT.md`
2. Follow each step carefully
3. Use `DEPLOYMENT_CHECKLIST.md` to track progress
4. **Time:** 2-3 hours for first-time deployment

### Option 2: Semi-Automated (Recommended for Speed)
1. Upload `deploy.sh` to your server
2. Run: `chmod +x deploy.sh && sudo ./deploy.sh`
3. Wait 15-20 minutes for script to complete
4. Follow manual steps in `PRODUCTION_DEPLOYMENT.md` from Step 7 onwards
5. **Time:** 1-2 hours

### Option 3: Expert Fast Track
```bash
# If you know what you're doing:
sudo ./deploy.sh                                    # Auto-install dependencies
cd /var/www/myplatform                             # Your app directory
git clone <your-repo>                              # Get code
cp .env.example .env && nano .env                  # Configure
npm install && npm run build                        # Build
npx prisma generate && npx prisma migrate deploy   # Setup DB
docker compose up -d                               # Start executor
pm2 start npm --name myplatform -- start           # Start app
# Configure Nginx, SSL, done!
```
**Time:** 30-45 minutes

---

## 🎯 What Gets Deployed

Your production stack includes:

### Application Layer
- ✅ Next.js 15 web application
- ✅ React 19 frontend
- ✅ Monaco Editor for code editing
- ✅ PM2 process manager (keeps app running)

### Database Layer
- ✅ PostgreSQL database
- ✅ Prisma ORM
- ✅ All migrations applied

### Code Execution Layer (8 Languages)
- ✅ Python 3.11
- ✅ TypeScript/JavaScript (Node.js 18)
- ✅ C/C++ (GCC 13)
- ✅ Java (Eclipse Temurin 17)
- ✅ C# (.NET SDK 8.0)
- ✅ PHP 8.2
- ✅ Go 1.21
- ✅ Rust 1.72

### Infrastructure Layer
- ✅ Docker for code isolation
- ✅ Nginx reverse proxy
- ✅ SSL/HTTPS (Let's Encrypt)
- ✅ UFW firewall
- ✅ fail2ban security

---

## 📊 Server Requirements

### Minimum (Small Traffic)
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 40GB SSD
- **Bandwidth:** 1TB/month
- **OS:** Ubuntu 22.04 LTS
- **Cost:** ~$12-20/month (DigitalOcean, Vultr, Linode)

### Recommended (Medium Traffic)
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 80GB SSD
- **Bandwidth:** 3TB/month
- **OS:** Ubuntu 22.04 LTS
- **Cost:** ~$40-60/month

### High Traffic (100+ concurrent users)
- **CPU:** 8+ cores
- **RAM:** 16GB+
- **Storage:** 160GB+ SSD
- **Bandwidth:** 5TB+/month
- **OS:** Ubuntu 22.04 LTS
- **Cost:** ~$100+/month

---

## 🔧 What the deploy.sh Script Does

The automated script handles:

1. ✅ System update and upgrade
2. ✅ Install Docker + Docker Compose
3. ✅ Install Node.js 20.x + npm
4. ✅ Install PostgreSQL database
5. ✅ Install Nginx web server
6. ✅ Install PM2 process manager
7. ✅ Download all 8 Docker images for code execution
8. ✅ Install Certbot for SSL
9. ✅ Install fail2ban for security
10. ✅ Configure firewall (UFW)
11. ✅ Create necessary directories

**What it DOESN'T do (you must do manually):**
- ❌ Create database and user
- ❌ Clone your code
- ❌ Configure .env file
- ❌ Build your application
- ❌ Configure Nginx with your domain
- ❌ Obtain SSL certificate
- ❌ Start your application

---

## 🔐 Security Checklist

Before going live, ensure:

- [ ] Strong PostgreSQL password
- [ ] NEXTAUTH_SECRET is 32+ random characters
- [ ] Firewall enabled and configured
- [ ] SSL/HTTPS working on all pages
- [ ] fail2ban running
- [ ] No .env file in git repository
- [ ] No sensitive data in logs
- [ ] Database backups automated
- [ ] Only necessary ports open (22, 80, 443)
- [ ] SSH key authentication enabled (password disabled)
- [ ] Regular security updates scheduled

---

## 📈 Expected Performance

After deployment, you should see:

### Page Load Times
- **Home page:** < 2 seconds
- **Tutorial pages:** < 2 seconds
- **Exercise pages:** < 3 seconds
- **Code editor:** < 1 second (Monaco loads fast)

### Code Execution Times
- **Python:** 2-5 seconds
- **JavaScript/TypeScript:** 3-8 seconds (includes compilation)
- **C/C++:** 3-8 seconds (includes compilation)
- **Java:** 5-10 seconds (includes compilation)
- **Others:** 3-8 seconds

### Concurrent Users
- **Minimum setup:** 10-20 users
- **Recommended setup:** 50-100 users
- **High-end setup:** 200+ users

---

## 🐛 Common Deployment Issues

### Issue 1: "Cannot connect to database"
**Cause:** DATABASE_URL incorrect or PostgreSQL not running
**Solution:** 
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U myplatform_user -d myplatform -h localhost
```

### Issue 2: "Port 3000 already in use"
**Cause:** Another process using port 3000
**Solution:**
```bash
# Find process
sudo lsof -i :3000

# Kill it
sudo kill -9 <PID>
```

### Issue 3: "Docker permission denied"
**Cause:** User not in docker group
**Solution:**
```bash
sudo usermod -aG docker $USER
# Then log out and log back in
```

### Issue 4: "Nginx 502 Bad Gateway"
**Cause:** Next.js app not running
**Solution:**
```bash
pm2 restart myplatform
pm2 logs myplatform
```

### Issue 5: "SSL certificate error"
**Cause:** Domain not pointing to server or certbot failed
**Solution:**
```bash
# Verify DNS
dig yourdomain.com

# Re-run certbot
sudo certbot --nginx -d yourdomain.com
```

---

## 📞 Support & Maintenance

### Daily Tasks
```bash
# Quick health check
pm2 status && docker ps
```

### Weekly Tasks
```bash
# Check disk space
df -h

# Review logs
pm2 logs myplatform --lines 100
```

### Monthly Tasks
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker pull python:3.11
docker pull node:18
# ... etc

# Verify backups
ls -lh /var/backups/myplatform/
```

---

## 🔄 Updating Your Application

When you push updates to your repository:

```bash
# SSH into your server
ssh user@yourdomain.com

# Navigate to app directory
cd /var/www/myplatform

# Pull latest code
git pull origin main

# Install new dependencies (if any)
npm install

# Run new migrations (if any)
npx prisma migrate deploy
npx prisma generate

# Rebuild
npm run build

# Restart
pm2 restart myplatform

# Verify
pm2 logs myplatform --lines 20
```

**Zero-downtime deployment:** Use PM2 reload instead
```bash
pm2 reload myplatform
```

---

## 💾 Backup & Recovery

### Manual Backup
```bash
# Backup database
sudo -u postgres pg_dump myplatform > backup.sql

# Backup files (if any uploads)
tar -czf files_backup.tar.gz /var/www/myplatform/public/uploads
```

### Automated Daily Backup
```bash
# Edit crontab
sudo crontab -e

# Add this line (runs at 2 AM daily)
0 2 * * * sudo -u postgres pg_dump myplatform > /var/backups/myplatform/db_$(date +\%Y\%m\%d).sql
```

### Restore from Backup
```bash
# Restore database
sudo -u postgres psql myplatform < backup.sql

# Restore files
tar -xzf files_backup.tar.gz -C /
```

---

## 📊 Monitoring Dashboard

### View Real-time Metrics
```bash
# PM2 monitoring dashboard
pm2 monit

# System resources
htop

# Disk usage
ncdu /var/www/myplatform
```

### Check Logs
```bash
# Application logs
pm2 logs myplatform --lines 100

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Docker logs
docker logs code-executor
```

---

## 🎓 Learning Resources

If you're new to server deployment:

1. **Linux basics:** Learn Ubuntu command line
2. **Docker basics:** Understand containers and images
3. **Nginx basics:** Reverse proxy concepts
4. **Database basics:** PostgreSQL fundamentals
5. **Security basics:** Firewall, SSL, user permissions

**Recommended tutorials:**
- DigitalOcean Tutorials (excellent for Ubuntu)
- Docker Getting Started Guide
- Nginx Beginner's Guide
- PostgreSQL Tutorial

---

## ✅ Post-Deployment Checklist

After deployment is complete:

- [ ] Application accessible via HTTPS
- [ ] All pages loading correctly
- [ ] User registration works
- [ ] User login works
- [ ] All 8 programming languages execute code
- [ ] Database queries fast
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs
- [ ] SSL certificate valid
- [ ] Backups running automatically
- [ ] Monitoring tools setup
- [ ] Documentation updated with server details

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ You can access https://yourdomain.com
2. ✅ Users can register and login
3. ✅ All tutorial pages work
4. ✅ All exercise pages work
5. ✅ Code execution works for all languages
6. ✅ No errors in logs
7. ✅ Page load times < 3 seconds
8. ✅ SSL certificate valid
9. ✅ Backups running
10. ✅ You're monitoring the system

---

## 📞 Getting Help

If you encounter issues:

1. **Check the logs first** - 90% of issues are visible in logs
2. **Review the troubleshooting section** in PRODUCTION_DEPLOYMENT.md
3. **Google the error message** - chances are someone solved it before
4. **Check Stack Overflow** - huge deployment knowledge base
5. **Review Docker/Nginx/PostgreSQL docs** - official documentation is best

---

## 🚀 Ready to Deploy?

1. Read **PRODUCTION_DEPLOYMENT.md** (full guide)
2. Print **DEPLOYMENT_CHECKLIST.md** (track progress)
3. Upload **deploy.sh** to your server (optional, but speeds things up)
4. Follow the steps carefully
5. Test thoroughly before announcing to users

**Estimated time for first deployment:** 2-3 hours

**Good luck with your deployment! 🎉**

---

**Last Updated:** 2024
**For:** Code Learning Platform Production Deployment
**Platform:** Ubuntu 22.04 LTS
