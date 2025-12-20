# 🚀 ShopDeploy - EC2 Deployment Guide (Amazon Linux)

Complete step-by-step guide to deploy ShopDeploy E-Commerce Application on Amazon Linux EC2.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Launch EC2 Instance](#2-launch-ec2-instance)
3. [Connect to EC2](#3-connect-to-ec2)
4. [Install Dependencies](#4-install-dependencies)
5. [Clone Repository](#5-clone-repository)
6. [Configure Environment](#6-configure-environment)
7. [Run with Docker Compose](#7-run-with-docker-compose)
8. [Run Without Docker](#8-run-without-docker-manual-setup)
9. [Configure Security Group](#9-configure-security-group)
10. [Access Application](#10-access-application)
11. [Setup as Service](#11-setup-as-systemd-service)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have:

- ✅ AWS Account with EC2 access
- ✅ Key Pair (.pem file) for SSH access
- ✅ MongoDB Atlas connection string (or install MongoDB locally)
- ✅ Stripe API keys (for payments)
- ✅ Cloudinary credentials (for image uploads)

---

## 2. Launch EC2 Instance

### Step 2.1: Go to AWS Console
```
AWS Console → EC2 → Launch Instance
```

### Step 2.2: Configure Instance

| Setting | Recommended Value |
|---------|-------------------|
| **Name** | `shopdeploy-server` |
| **AMI** | Amazon Linux 2023 AMI |
| **Instance Type** | `t2.medium` (minimum) or `t3.medium` |
| **Key Pair** | Select or create new key pair |
| **Storage** | 20 GB gp3 |

### Step 2.3: Network Settings
- ✅ Allow SSH (port 22) from your IP
- ✅ Allow HTTP (port 80) from anywhere
- ✅ Allow HTTPS (port 443) from anywhere
- ✅ Allow Custom TCP (port 3000) from anywhere
- ✅ Allow Custom TCP (port 5000) from anywhere

### Step 2.4: Launch Instance
Click **Launch Instance** and wait for it to be in **Running** state.

---

## 3. Connect to EC2

### Option A: Using Terminal (Linux/Mac)
```bash
# Set permissions for key file
chmod 400 your-key.pem

# Connect to EC2
ssh -i "your-key.pem" ec2-user@<EC2-PUBLIC-IP>
```

### Option B: Using PowerShell (Windows)
```powershell
ssh -i "your-key.pem" ec2-user@<EC2-PUBLIC-IP>
```

### Option C: Using EC2 Instance Connect
1. Go to EC2 Console
2. Select your instance
3. Click **Connect** → **EC2 Instance Connect** → **Connect**

---

## 4. Install Dependencies

### Step 4.1: Update System
```bash
sudo dnf update -y
```

### Step 4.2: Install Git
```bash
sudo dnf install git -y
git --version
```

### Step 4.3: Install Docker
```bash
# Install Docker
sudo dnf install docker -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user

# Apply group changes (or logout and login again)
newgrp docker

# Verify Docker
docker --version
```

### Step 4.4: Install Docker Compose
```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

### Step 4.5: Install Node.js (Optional - for non-Docker setup)
```bash
# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install nodejs -y

# Verify installation
node --version
npm --version
```

---

## 5. Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone the repository
git clone https://github.com/khushalbhavsar/shopdeploy.git

# Navigate to project directory
cd shopdeploy
```

---

## 6. Configure Environment

### Step 6.1: Create Backend Environment File
```bash
# Navigate to backend
cd ~/shopdeploy/shopdeploy-backend

# Create .env file
nano .env
```

### Step 6.2: Add Backend Environment Variables
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopdeploy?retryWrites=true&w=majority

# JWT Secrets (Generate strong random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key

# Cloudinary Image Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://<EC2-PUBLIC-IP>:3000
```

Save and exit: `Ctrl + X`, then `Y`, then `Enter`

### Step 6.3: Create Frontend Environment File
```bash
# Navigate to frontend
cd ~/shopdeploy/shopdeploy-frontend

# Create .env file
nano .env
```

### Step 6.4: Add Frontend Environment Variables
```env
VITE_API_URL=http://<EC2-PUBLIC-IP>:5000/api
```

Save and exit: `Ctrl + X`, then `Y`, then `Enter`

---

## 7. Run with Docker Compose

### Step 7.1: Navigate to Project Root
```bash
cd ~/shopdeploy
```

### Step 7.2: Build and Start Containers
```bash
# Build and run in detached mode
docker-compose up -d --build

# View running containers
docker ps

# View logs
docker-compose logs -f
```

### Step 7.3: Verify Containers
```bash
# Check container status
docker-compose ps

# Expected output:
# NAME                    STATUS
# shopdeploy-backend      Up
# shopdeploy-frontend     Up
# shopdeploy-mongodb      Up (if using local MongoDB)
```

### Step 7.4: Stop Containers (When needed)
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 8. Run Without Docker (Manual Setup)

### Step 8.1: Install MongoDB (If not using Atlas)
```bash
# Create MongoDB repo file
sudo nano /etc/yum.repos.d/mongodb-org-7.0.repo
```

Add the following content:
```ini
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
```

```bash
# Install MongoDB
sudo dnf install mongodb-org -y

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB
sudo systemctl status mongod
```

### Step 8.2: Start Backend
```bash
# Navigate to backend
cd ~/shopdeploy/shopdeploy-backend

# Install dependencies
npm ci --production

# Start backend (using PM2 for production)
npm install -g pm2
pm2 start src/server.js --name shopdeploy-backend

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
```

### Step 8.3: Build and Serve Frontend
```bash
# Navigate to frontend
cd ~/shopdeploy/shopdeploy-frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Install serve globally
npm install -g serve

# Serve the built files
pm2 start serve --name shopdeploy-frontend -- -s dist -l 3000

# Save PM2 configuration
pm2 save
```

### Step 8.4: Verify Services
```bash
# Check PM2 processes
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

---

## 9. Configure Security Group

Ensure your EC2 Security Group has the following inbound rules:

| Type | Protocol | Port Range | Source | Description |
|------|----------|------------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH Access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web Traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure Web Traffic |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 | Backend API |

### Update Security Group via AWS CLI
```bash
# Get your Security Group ID
SECURITY_GROUP_ID=sg-xxxxxxxxx

# Add rules
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5000 \
    --cidr 0.0.0.0/0
```

---

## 10. Access Application

### Frontend (React App)
```
http://<EC2-PUBLIC-IP>:3000
```

### Backend API
```
http://<EC2-PUBLIC-IP>:5000/api
```

### Health Check
```
http://<EC2-PUBLIC-IP>:5000/api/health/health
```

### Find Your EC2 Public IP
```bash
# From within EC2
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Or check AWS Console
```

---

## 11. Setup as Systemd Service

### Step 11.1: Create Backend Service
```bash
sudo nano /etc/systemd/system/shopdeploy-backend.service
```

Add the following content:
```ini
[Unit]
Description=ShopDeploy Backend API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/shopdeploy/shopdeploy-backend
ExecStart=/usr/bin/node src/server.js
Restart=on-failure
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/home/ec2-user/shopdeploy/shopdeploy-backend/.env

[Install]
WantedBy=multi-user.target
```

### Step 11.2: Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable shopdeploy-backend

# Start service
sudo systemctl start shopdeploy-backend

# Check status
sudo systemctl status shopdeploy-backend
```

---

## 12. Troubleshooting

### Check Container Logs
```bash
# All containers
docker-compose logs -f

# Specific container
docker logs shopdeploy-backend -f
docker logs shopdeploy-frontend -f
```

### Check Application Logs
```bash
# PM2 logs
pm2 logs shopdeploy-backend
pm2 logs shopdeploy-frontend

# Systemd logs
sudo journalctl -u shopdeploy-backend -f
```

### Common Issues

#### Issue: Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

#### Issue: Permission Denied (Docker)
```bash
# Add user to docker group
sudo usermod -aG docker ec2-user

# Logout and login again
exit
# Reconnect via SSH
```

#### Issue: MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Verify connection string in .env file
```

#### Issue: Cannot Access from Browser
```bash
# Check if services are running
docker ps
# or
pm2 list

# Check security group rules in AWS Console
# Ensure ports 3000 and 5000 are open

# Check firewall (if enabled)
sudo firewall-cmd --list-all
```

#### Issue: Environment Variables Not Loading
```bash
# Verify .env file exists
cat ~/shopdeploy/shopdeploy-backend/.env

# Check file permissions
ls -la ~/shopdeploy/shopdeploy-backend/.env
```

---

## 🎉 Deployment Complete!

Your ShopDeploy application should now be running on:

| Service | URL |
|---------|-----|
| **Frontend** | `http://<EC2-PUBLIC-IP>:3000` |
| **Backend API** | `http://<EC2-PUBLIC-IP>:5000/api` |
| **Health Check** | `http://<EC2-PUBLIC-IP>:5000/api/health/health` |

---

## 📌 Quick Reference Commands

```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Check running containers
docker ps

# PM2 commands (non-Docker)
pm2 list
pm2 restart all
pm2 logs
pm2 monit
```

---

## 🔒 Production Recommendations

1. **Use HTTPS** - Setup SSL with Let's Encrypt and Nginx reverse proxy
2. **Use Domain** - Point a domain to your EC2 Elastic IP
3. **Enable Monitoring** - Setup CloudWatch alarms
4. **Backup Database** - Enable MongoDB Atlas backups or setup local backups
5. **Use Load Balancer** - For high availability
6. **Auto Scaling** - Setup Auto Scaling Group for traffic spikes

---

<p align="center">
  <b>Happy Deploying! 🚀</b>
</p>
