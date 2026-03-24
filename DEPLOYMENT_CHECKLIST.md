# 🚀 Quick Deployment Checklist

Use this checklist to ensure you complete all deployment steps.

## Pre-Deployment Checklist

- [ ] Fresh Ubuntu 22.04 server ready
- [ ] Root/sudo access confirmed
- [ ] Domain name configured (pointing to server IP)
- [ ] SSH access working
- [ ] Server specs: Minimum 4GB RAM, 2 CPU cores, 40GB storage

---

## Deployment Steps Checklist

### System Setup
- [ ] System updated (`apt update && apt upgrade`)
- [ ] Basic tools installed (curl, wget, git, build-essential)
- [ ] Firewall configured (UFW enabled)

### Docker Installation
- [ ] Docker installed and running
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Docker verified (`docker --version`)

### Node.js Setup
- [ ] Node.js 20.x installed
- [ ] NPM verified (`npm --version`)
- [ ] PM2 installed globally (`npm install -g pm2`)

### Database Setup
- [ ] PostgreSQL installed
- [ ] PostgreSQL running and enabled on boot
- [ ] Database `mydb` created
- [ ] Database user `murad` created with password
- [ ] Database permissions granted

### Docker Images
- [ ] Python 3.11 image pulled (`docker pull python:3.11`)
- [ ] Node.js 18 image pulled (`docker pull node:18`)
- [ ] GCC 13 image pulled (`docker pull gcc:13`)
- [ ] Eclipse Temurin 17 image pulled (`docker pull eclipse-temurin:17-jdk`)
- [ ] PHP 8.2 image pulled (`docker pull php:8.2-cli`)
- [ ] Go 1.21 image pulled (`docker pull golang:1.21`)
- [ ] Rust 1.72 image pulled (`docker pull rust:1.72`)
- [ ] .NET SDK 8.0 image pulled (`docker pull mcr.microsoft.com/dotnet/sdk:8.0`)
- [ ] All images verified (`docker images`)

### Application Setup
- [ ] Code cloned/uploaded to `/var/www/myplatform`
- [ ] `.env` file created with correct values
- [ ] NEXTAUTH_SECRET generated
- [ ] DATABASE_URL configured correctly
- [ ] NPM dependencies installed (`npm install`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Application built (`npm run build`)

### Services
- [ ] Code executor container started (`docker compose up -d`)
- [ ] Code executor verified running (`docker ps`)
- [ ] PM2 started application (`pm2 start npm --name myplatform -- start`)
- [ ] PM2 saved (`pm2 save`)
- [ ] PM2 startup configured (`pm2 startup`)
- [ ] Application accessible on localhost:3000

### Nginx Setup
- [ ] Nginx installed
- [ ] Nginx configuration created at `/etc/nginx/sites-available/myplatform`
- [ ] Configuration file edited with correct domain
- [ ] Site enabled (symlink created)
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx restarted

### SSL Setup
- [ ] Certbot installed
- [ ] SSL certificate obtained for domain
- [ ] HTTPS verified working
- [ ] Auto-renewal tested (`certbot renew --dry-run`)

### Security
- [ ] Firewall enabled with correct rules
- [ ] SSH allowed through firewall
- [ ] HTTP/HTTPS allowed through firewall
- [ ] Strong passwords used for database
- [ ] NEXTAUTH_SECRET is long and random
- [ ] Fail2ban installed (optional but recommended)

### Testing
- [ ] Application responds on localhost:3000
- [ ] Nginx proxy works (http://yourdomain.com)
- [ ] HTTPS works (https://yourdomain.com)
- [ ] Can access home page
- [ ] Can register/login
- [ ] Python code execution works
- [ ] TypeScript code execution works
- [ ] C++ code execution works
- [ ] Java code execution works
- [ ] Other languages tested

### Monitoring & Logs
- [ ] PM2 logs accessible (`pm2 logs`)
- [ ] PM2 monitoring works (`pm2 monit`)
- [ ] Nginx logs accessible
- [ ] Docker logs accessible
- [ ] Log rotation configured

### Backup
- [ ] Backup directory created (`/var/backups/myplatform`)
- [ ] Manual database backup tested
- [ ] Automated backup cron job created
- [ ] Backup restoration tested

---

## Post-Deployment Checklist

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] All tutorial pages load
- [ ] All exercise pages load
- [ ] Code editor loads properly
- [ ] Python execution works
- [ ] TypeScript execution works
- [ ] C/C++ execution works
- [ ] Java execution works
- [ ] C# execution works
- [ ] PHP execution works
- [ ] Go execution works
- [ ] Rust execution works
- [ ] User profile pages work
- [ ] Settings page works
- [ ] Achievement system works
- [ ] Goal tracking works
- [ ] Favorites work

### Performance Tests
- [ ] Page load times acceptable (<3 seconds)
- [ ] Code execution times reasonable (<30 seconds)
- [ ] Multiple concurrent users work
- [ ] Database queries fast
- [ ] No memory leaks observed

### Security Verification
- [ ] HTTPS working on all pages
- [ ] HTTP redirects to HTTPS
- [ ] SQL injection protected (Prisma ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled (NextAuth)
- [ ] Code execution isolated (Docker)
- [ ] No sensitive data in logs
- [ ] Environment variables not exposed

---

## Common Issues & Solutions

### ❌ "Cannot connect to database"
**Solution:** Check DATABASE_URL in .env file, verify PostgreSQL is running

### ❌ "Port 3000 already in use"
**Solution:** Kill existing process with `sudo lsof -i :3000` then `kill -9 <PID>`

### ❌ "Docker permission denied"
**Solution:** Add user to docker group and re-login

### ❌ "Nginx 502 Bad Gateway"
**Solution:** Verify Next.js app is running with `pm2 status`

### ❌ "SSL certificate error"
**Solution:** Re-run certbot, check domain DNS points to server

### ❌ "Code execution timeout"
**Solution:** Check Docker images are downloaded, verify executor container is running

---

## Emergency Procedures

### Restart Everything
```bash
# Restart application
pm2 restart myplatform

# Restart Docker
sudo systemctl restart docker
docker compose restart

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Check All Services
```bash
# Check application
pm2 status

# Check Docker
docker ps

# Check Nginx
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql

# Check disk space
df -h

# Check memory
free -h
```

### View Logs
```bash
# Application logs
pm2 logs myplatform --lines 100

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Docker logs
docker logs code-executor

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## Important URLs & Credentials

**Remember to save these securely!**

### Server Info
- **Server IP:** _________________
- **Domain:** _________________
- **SSH Port:** 22 (or custom: _______)
- **SSH User:** _________________

### Application URLs
- **Production URL:** https://_________________
- **Admin Panel:** https://________________/admin (if applicable)

### Database
- **Host:** localhost
- **Port:** 5432
- **Database:** myplatform
- **Username:** myplatform_user
- **Password:** _________________ (KEEP SECRET!)

### Secrets
- **NEXTAUTH_SECRET:** _________________ (KEEP SECRET!)

---

## Maintenance Schedule

### Daily
- [ ] Check PM2 status
- [ ] Check disk space
- [ ] Review error logs

### Weekly
- [ ] Check for system updates
- [ ] Review application logs
- [ ] Check Docker container status
- [ ] Verify backups are running

### Monthly
- [ ] Apply security updates
- [ ] Update Docker images
- [ ] Test backup restoration
- [ ] Review and clean old logs
- [ ] Check SSL certificate expiry

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Update all dependencies
- [ ] Capacity planning review

---

## Contact & Support

### Important Commands Quick Reference
```bash
# Restart app
pm2 restart myplatform

# View logs
pm2 logs myplatform

# Check status
pm2 status && docker ps && sudo systemctl status nginx

# Backup database
sudo -u postgres pg_dump myplatform > backup_$(date +%Y%m%d).sql

# Update application
cd /var/www/myplatform && git pull && npm install && npm run build && pm2 restart myplatform
```

---

**Last Updated:** $(date)
**Deployed By:** _________________
**Deployment Date:** _________________

---

**🎉 Deployment Complete! Your application is live!**
