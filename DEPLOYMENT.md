# 🚀 Deployment Guide - RubberPanel

This guide covers deploying the Rubber Plantation Management System to production environments.

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 13+ with PostGIS extension
- Nginx (for production)
- SSL certificate (recommended)

## 🗄️ Database Migration (SQLite → PostgreSQL)

### 1. Install PostgreSQL with PostGIS

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib postgis postgresql-13-postgis-3
```

**CentOS/RHEL:**
```bash
sudo yum install postgresql13-server postgresql13-contrib postgis
```

### 2. Configure PostgreSQL

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
-- Create database
CREATE DATABASE rubber_plantation;

-- Create user
CREATE USER rubber_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rubber_plantation TO rubber_user;

-- Enable PostGIS extension
\c rubber_plantation;
CREATE EXTENSION postgis;
```

### 3. Update Backend Configuration

Create `backend/.env`:
```env
NODE_ENV=production
PORT=5000
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rubber_plantation
DB_USER=rubber_user
DB_PASSWORD=secure_password
FRONTEND_URL=https://yourdomain.com
```

### 4. Run Migration

```bash
cd backend
npm install
npm run migrate
npm run seed
```

## 🐳 Docker Deployment

### 1. Create Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:13-3.1
    environment:
      POSTGRES_DB: rubber_plantation
      POSTGRES_USER: rubber_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: rubber_plantation
      DB_USER: rubber_user
      DB_PASSWORD: secure_password
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 2. Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### 3. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Scale backend if needed
docker-compose up -d --scale backend=3
```

## 🌐 Nginx Configuration

Create `/etc/nginx/sites-available/rubber-panel`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # Frontend
    location / {
        root /var/www/rubber-panel/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads {
        alias /var/www/rubber-panel/backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/rubber-panel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Configuration

### 1. Environment Security

```bash
# Set secure file permissions
chmod 600 backend/.env
chown www-data:www-data backend/.env

# Disable directory listing
echo "Options -Indexes" > backend/.htaccess
```

### 2. Database Security

```sql
-- Create read-only user for reporting
CREATE USER rubber_readonly WITH PASSWORD 'readonly_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rubber_readonly;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
SELECT pg_reload_conf();
```

### 3. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 5432/tcp
sudo ufw enable

# iptables (CentOS)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5432 -j DROP
```

## 📊 Monitoring & Logging

### 1. Application Monitoring

Install PM2 for process management:
```bash
npm install -g pm2

# Start application
pm2 start backend/server.js --name "rubber-backend"
pm2 startup
pm2 save
```

### 2. Database Monitoring

```bash
# Install pgAdmin or use built-in monitoring
sudo apt-get install pgadmin4

# Monitor queries
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### 3. Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/rubber-panel

# Log rotation config
/var/log/rubber-panel/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

## 🔄 Backup & Recovery

### 1. Database Backup

```bash
# Create backup script
cat > /usr/local/bin/backup-rubber-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U rubber_user rubber_plantation > /backups/rubber_plantation_$DATE.sql
gzip /backups/rubber_plantation_$DATE.sql
find /backups -name "rubber_plantation_*.sql.gz" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-rubber-db.sh

# Schedule daily backups
echo "0 2 * * * /usr/local/bin/backup-rubber-db.sh" | crontab -
```

### 2. Application Backup

```bash
# Backup application files
tar -czf /backups/rubber-panel-$(date +%Y%m%d).tar.gz /var/www/rubber-panel/
```

### 3. Recovery Process

```bash
# Restore database
gunzip /backups/rubber_plantation_20240101_020000.sql.gz
psql -h localhost -U rubber_user rubber_plantation < /backups/rubber_plantation_20240101_020000.sql

# Restore application
tar -xzf /backups/rubber-panel-20240101.tar.gz -C /
```

## 🚀 Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_tapping_records_date ON tapping_records(date);
CREATE INDEX idx_health_metrics_block_date ON health_metrics(block_id, date);
CREATE INDEX idx_workers_active ON workers(is_active);

-- Analyze tables
ANALYZE;
```

### 2. Application Optimization

```bash
# Enable gzip compression in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Load Balancing

```nginx
upstream backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

location /api {
    proxy_pass http://backend;
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Test connection
   psql -h localhost -U rubber_user -d rubber_plantation
   ```

2. **Frontend Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **API CORS Issues**
   ```bash
   # Check CORS configuration in backend
   # Ensure FRONTEND_URL is set correctly
   ```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Database health
psql -h localhost -U rubber_user -d rubber_plantation -c "SELECT 1;"

# Frontend health
curl http://localhost/
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancer (HAProxy, Nginx)
- Multiple backend instances
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)
- Use connection pooling

---

**For additional support, contact the SPATIO SDS development team.**




