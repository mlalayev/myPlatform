# 🌐 Nginx Setup Guide - Remove :3000 & Enable HTTPS

This guide shows you how to access your site as `https://yourdomain.com` instead of `http://yourserver:3000`

---

## 📋 What We'll Do

1. Install Nginx
2. Configure Nginx as reverse proxy (removes :3000)
3. Install SSL certificate (enables HTTPS)
4. Configure firewall
5. Test everything

---

## 🚀 STEP 1: Install Nginx

### 1.1 Install Nginx
```bash
sudo apt update
sudo apt install -y nginx
```
**What it does:** Installs Nginx web server.

### 1.2 Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```
**What it does:** Starts Nginx and enables it to start on boot.

### 1.3 Check Nginx status
```bash
sudo systemctl status nginx
```
**What it does:** Confirms Nginx is running.

---

## 🔧 STEP 2: Configure Nginx (Remove :3000)

### 2.1 Create Nginx configuration file
```bash
sudo nano /etc/nginx/sites-available/myplatform
```

### 2.2 Paste this configuration
```nginx
# HTTP Server Block (will redirect to HTTPS after SSL setup)
server {
    listen 80;
    listen [::]:80;
    
    # Replace with your domain or server IP
    server_name yourdomain.com www.yourdomain.com;
    
    # Max upload size for code submissions
    client_max_body_size 10M;
    
    # Proxy settings
    location / {
        # Forward requests to Next.js app on port 3000
        proxy_pass http://localhost:3000;
        
        # WebSocket support (for live reloading in dev)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Forward real client IP
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Don't cache
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts (important for code execution)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Optimize static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_bypass $http_upgrade;
        
        # Cache static assets for 1 year
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression for better performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
}
```

**⚠️ IMPORTANT:** Replace `yourdomain.com` with:
- Your actual domain: `myawesomesite.com`
- OR your server IP: `123.45.67.89`

**What this does:**
- ✅ Listens on port 80 (HTTP)
- ✅ Forwards all requests to your Next.js app on port 3000
- ✅ Users access: `http://yourdomain.com` (no :3000!)
- ✅ Adds proper headers
- ✅ Sets timeouts for code execution
- ✅ Enables compression

### 2.3 Save the file
Press `Ctrl + X`, then `Y`, then `Enter`

### 2.4 Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/myplatform /etc/nginx/sites-enabled/
```
**What it does:** Activates your configuration.

### 2.5 Remove default site (optional)
```bash
sudo rm /etc/nginx/sites-enabled/default
```
**What it does:** Removes the default Nginx welcome page.

### 2.6 Test Nginx configuration
```bash
sudo nginx -t
```
**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.7 Reload Nginx
```bash
sudo systemctl reload nginx
```
**What it does:** Applies your new configuration.

---

## 🎉 TEST: Access Without :3000

Now try accessing your site:

```bash
# If using domain:
curl http://yourdomain.com

# If using IP:
curl http://123.45.67.89
```

**You should see your website HTML!** 

Open in browser:
- `http://yourdomain.com` (if you have domain)
- `http://your-server-ip` (if using IP)

**No more :3000 needed!** ✅

---

## 🔒 STEP 3: Setup HTTPS (SSL Certificate)

Now let's enable HTTPS with a **FREE SSL certificate** from Let's Encrypt!

### 3.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```
**What it does:** Installs SSL certificate manager.

### 3.2 Get SSL certificate

**If using a DOMAIN:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**If using ONLY IP (Not recommended, but possible):**
SSL certificates don't work with IPs directly. You need a domain. 
But you can use services like:
- NoIP.com (free subdomain)
- DuckDNS.org (free subdomain)
- Or buy a domain ($10-15/year)

### 3.3 Follow Certbot prompts:

**Prompt 1:** Enter your email
```
Enter email address (used for urgent renewal and security notices)
```
Type your email and press Enter.

**Prompt 2:** Agree to terms
```
Please read the Terms of Service at https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf.
(A)gree/(C)ancel:
```
Type `A` and press Enter.

**Prompt 3:** Share email (optional)
```
Would you be willing to share your email address with the Electronic Frontier Foundation?
(Y)es/(N)o:
```
Type `N` and press Enter (or Y if you want).

**Prompt 4:** Redirect HTTP to HTTPS
```
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
1: No redirect
2: Redirect - Make all requests redirect to secure HTTPS access
Select the appropriate number [1-2]:
```
Type `2` and press Enter (recommended!).

**What this does:**
- ✅ Gets FREE SSL certificate
- ✅ Automatically configures Nginx for HTTPS
- ✅ Sets up automatic renewal (certificate valid 90 days)
- ✅ Redirects HTTP → HTTPS

### 3.4 Verify SSL certificate
```bash
sudo certbot certificates
```
**What it does:** Shows your installed certificates.

---

## 🎉 TEST: Access with HTTPS

Now try accessing with HTTPS:

```bash
curl https://yourdomain.com
```

Open in browser:
- ✅ `https://yourdomain.com` (with padlock 🔒)
- ✅ `http://yourdomain.com` (redirects to HTTPS)

**Your site is now secure!** 🔒

---

## 🔥 STEP 4: Configure Firewall

### 4.1 Allow Nginx through firewall
```bash
sudo ufw allow 'Nginx Full'
```
**What it does:** Opens ports 80 (HTTP) and 443 (HTTPS).

### 4.2 Check firewall status
```bash
sudo ufw status
```
**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

---

## ✅ STEP 5: Test Auto-Renewal

SSL certificates expire every 90 days. Let's test auto-renewal:

### 5.1 Test renewal (dry run)
```bash
sudo certbot renew --dry-run
```
**What it does:** Tests certificate renewal without actually renewing.

**Expected output:**
```
Congratulations, all simulated renewals succeeded
```

### 5.2 Check renewal timer
```bash
sudo systemctl status certbot.timer
```
**What it does:** Confirms auto-renewal is scheduled.

**Certbot automatically renews certificates before they expire!** ✅

---

## 🎯 What You Achieved

### Before:
- ❌ `http://yourserver:3000` (ugly, insecure)
- ❌ Users need to remember port number
- ❌ No encryption
- ❌ "Not Secure" warning in browser

### After:
- ✅ `https://yourdomain.com` (clean, professional)
- ✅ No port number needed
- ✅ SSL encryption (padlock in browser)
- ✅ "Secure" indicator
- ✅ SEO benefits (Google favors HTTPS)
- ✅ Auto-renewal (no manual certificate management)

---

## 📊 Full Configuration Summary

```
┌─────────────┐
│   Browser   │
│   (User)    │
└──────┬──────┘
       │
       │ HTTPS (Port 443)
       │ https://yourdomain.com
       │
┌──────▼──────┐
│    Nginx    │ ← Reverse Proxy
│  (Port 80,  │
│   Port 443) │
└──────┬──────┘
       │
       │ HTTP (Port 3000)
       │ localhost:3000
       │
┌──────▼──────┐
│   Next.js   │ ← Your Application
│  (PM2/Node) │
│  Port 3000  │
└─────────────┘
```

---

## 🔧 Useful Nginx Commands

### Check Nginx status
```bash
sudo systemctl status nginx
```

### Start Nginx
```bash
sudo systemctl start nginx
```

### Stop Nginx
```bash
sudo systemctl stop nginx
```

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Reload Nginx (no downtime)
```bash
sudo systemctl reload nginx
```

### Test configuration
```bash
sudo nginx -t
```

### View Nginx logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🐛 Troubleshooting

### Problem 1: "502 Bad Gateway"
**Cause:** Next.js app not running.

**Solution:**
```bash
# Check if app is running
pm2 status

# If not running, start it
pm2 start npm --name myplatform -- start

# Check logs
pm2 logs myplatform
```

### Problem 2: "Connection refused"
**Cause:** Nginx not running.

**Solution:**
```bash
sudo systemctl start nginx
sudo systemctl status nginx
```

### Problem 3: SSL certificate fails
**Cause:** Domain not pointing to server.

**Solution:**
```bash
# Check DNS
dig yourdomain.com

# Make sure it shows your server IP
# Wait 5-60 minutes for DNS propagation
```

### Problem 4: "nginx: [emerg] bind() failed"
**Cause:** Port 80/443 already in use.

**Solution:**
```bash
# Check what's using port 80
sudo lsof -i :80

# Check what's using port 443
sudo lsof -i :443

# If Apache is running, stop it
sudo systemctl stop apache2
sudo systemctl disable apache2
```

### Problem 5: Can't access site from browser
**Cause:** Firewall blocking ports.

**Solution:**
```bash
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

---

## 🔒 Security Best Practices

### 1. Force HTTPS (Already done by Certbot)
All HTTP traffic redirects to HTTPS.

### 2. Security Headers (Optional Enhancement)
Add to your Nginx config:

```nginx
# Add these inside the server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

Then reload:
```bash
sudo nano /etc/nginx/sites-available/myplatform
# Add the headers
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Rate Limiting (Optional)
Prevent abuse:

```nginx
# Add at the top of nginx.conf
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# Add inside location block
limit_req zone=mylimit burst=20 nodelay;
```

---

## 📝 Complete Nginx Config Example (With HTTPS)

After running Certbot, your config will look like this:

```nginx
# HTTP - Redirects to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Certbot adds this redirect automatically
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Certificate (added by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Max upload size
    client_max_body_size 10M;
    
    # Proxy to Next.js
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
}
```

---

## ✅ Checklist

- [ ] Nginx installed
- [ ] Nginx configuration created
- [ ] Domain/IP configured in Nginx config
- [ ] Configuration tested (`sudo nginx -t`)
- [ ] Nginx reloaded
- [ ] Site accessible without :3000
- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] HTTPS working (padlock visible)
- [ ] HTTP redirects to HTTPS
- [ ] Auto-renewal tested
- [ ] Firewall configured
- [ ] PM2 app running
- [ ] All tests passing

---

## 🎉 Success!

You should now be able to access your site at:

✅ **`https://yourdomain.com`**

- No port number (`:3000`)
- HTTPS enabled (🔒 padlock)
- Secure connection
- Professional URL
- Auto-renewing certificate

**Your site is production-ready!** 🚀

---

## 📞 Quick Reference

### Check if everything is running
```bash
# Check Nginx
sudo systemctl status nginx

# Check PM2
pm2 status

# Check firewall
sudo ufw status

# Check SSL certificates
sudo certbot certificates
```

### Restart everything
```bash
# Restart Nginx
sudo systemctl restart nginx

# Restart app
pm2 restart myplatform

# Check logs
pm2 logs myplatform
sudo tail -f /var/log/nginx/error.log
```

---

**Congratulations! Your site is now accessible via HTTPS without port numbers!** 🎉🔒
