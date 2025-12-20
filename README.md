# 🛒 ShopDeploy - E-Commerce Application

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/Kubernetes-EKS-326CE5?style=for-the-badge&logo=kubernetes" alt="Kubernetes"/>
</p>

<p align="center">
  <b>A full-stack e-commerce application with complete DevOps implementation including CI/CD, Kubernetes deployment, and cloud-native infrastructure.</b>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Local Development](#-local-development)
- [Docker Deployment](#-docker-deployment)
- [Kubernetes Deployment](#-kubernetes-deployment)
- [DevOps Infrastructure](#-devops-infrastructure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**ShopDeploy** is a modern, production-ready e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). The project demonstrates enterprise-level development practices and includes a comprehensive DevOps implementation with:

- 🏗️ **Infrastructure as Code** using Terraform
- 🐳 **Containerization** with Docker
- ☸️ **Orchestration** on AWS EKS (Kubernetes)
- 🔄 **CI/CD Pipeline** with Jenkins
- 📊 **Monitoring** with Prometheus & Grafana
- 📦 **Package Management** with Helm Charts

---

## ✨ Features

### Customer Features
- 🛍️ Browse products by categories
- 🔍 Search and filter products
- 🛒 Shopping cart management
- 💳 Secure checkout with Stripe
- 📦 Order tracking and history
- 👤 User authentication (JWT)
- 📱 Responsive design

### Admin Features
- 📊 Admin dashboard
- 📦 Product management (CRUD)
- 📋 Order management
- 👥 User management
- 📈 Sales analytics

### Technical Features
- 🔐 JWT-based authentication with refresh tokens
- 🖼️ Image upload with Cloudinary
- 💳 Payment processing with Stripe
- 📧 Email notifications
- 🔄 Real-time updates
- 📱 Mobile-responsive UI

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Library |
| Vite | Build Tool |
| Redux Toolkit | State Management |
| React Router | Navigation |
| Tailwind CSS | Styling |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18 | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Stripe | Payments |
| Cloudinary | Image Storage |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Kubernetes (EKS) | Orchestration |
| Terraform | Infrastructure as Code |
| Jenkins | CI/CD Pipeline |
| Helm | Package Management |
| Prometheus | Monitoring |
| Grafana | Visualization |
| AWS | Cloud Provider |

---

## 📁 Project Structure

```
ShopDeploy/
├── 📂 shopdeploy-backend/          # Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   ├── controllers/            # Route controllers
│   │   ├── middleware/             # Express middleware
│   │   ├── models/                 # Mongoose models
│   │   ├── routes/                 # API routes
│   │   ├── services/               # Business logic
│   │   └── utils/                  # Utility functions
│   ├── Dockerfile                  # Backend Docker image
│   └── package.json
│
├── 📂 shopdeploy-frontend/         # Frontend (React/Vite)
│   ├── src/
│   │   ├── api/                    # API client functions
│   │   ├── app/                    # Redux store
│   │   ├── components/             # Reusable components
│   │   ├── features/               # Redux slices
│   │   ├── layouts/                # Layout components
│   │   ├── pages/                  # Page components
│   │   ├── routes/                 # Route definitions
│   │   └── utils/                  # Helper functions
│   ├── Dockerfile                  # Frontend Docker image
│   └── package.json
│
├── 📂 terraform/                   # Infrastructure as Code
│   ├── main.tf                     # Main Terraform config
│   ├── variables.tf                # Input variables
│   ├── outputs.tf                  # Output values
│   └── modules/                    # Terraform modules
│       ├── vpc/                    # VPC configuration
│       ├── iam/                    # IAM roles & policies
│       ├── ecr/                    # Container registry
│       └── eks/                    # Kubernetes cluster
│
├── 📂 helm/                        # Helm Charts
│   ├── backend/                    # Backend Helm chart
│   └── frontend/                   # Frontend Helm chart
│
├── 📂 k8s/                         # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── ingress.yaml
│   └── hpa.yaml
│
├── 📂 monitoring/                  # Monitoring configuration
│   ├── prometheus-values.yaml
│   ├── grafana-values.yaml
│   └── dashboards/
│
├── 📂 scripts/                     # Automation scripts
│   ├── ec2-bootstrap.sh
│   ├── build.sh
│   ├── deploy.sh
│   └── ...
│
├── 📄 Jenkinsfile                  # CI/CD Pipeline
├── 📄 docker-compose.yml           # Local Docker setup
└── 📄 README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **MongoDB** (local or Atlas)
- **Docker** (for containerized deployment)
- **kubectl** (for Kubernetes deployment)

### Clone Repository

```bash
git clone https://github.com/yourusername/shopdeploy.git
cd shopdeploy
```

---

## 💻 Local Development

### Backend Setup

```bash
# Navigate to backend
cd shopdeploy-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend
cd shopdeploy-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health/health

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended for Development)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build Backend
cd shopdeploy-backend
docker build -t shopdeploy-backend:latest .

# Build Frontend
cd shopdeploy-frontend
docker build -t shopdeploy-frontend:latest .

# Run Backend
docker run -d -p 5000:5000 --env-file .env shopdeploy-backend:latest

# Run Frontend
docker run -d -p 3000:80 shopdeploy-frontend:latest
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- AWS CLI configured
- kubectl installed
- Helm v3 installed
- EKS cluster running (see Terraform section)

### Deploy with Helm

```bash
# Add namespace
kubectl create namespace shopdeploy

# Deploy Backend
helm upgrade --install shopdeploy-backend ./helm/backend \
  --namespace shopdeploy \
  --set image.repository=<ECR_URL>/shopdeploy-backend \
  --set image.tag=latest

# Deploy Frontend
helm upgrade --install shopdeploy-frontend ./helm/frontend \
  --namespace shopdeploy \
  --set image.repository=<ECR_URL>/shopdeploy-frontend \
  --set image.tag=latest

# Verify deployment
kubectl get pods -n shopdeploy
kubectl get svc -n shopdeploy
```

### Deploy with kubectl

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check status
kubectl get all -n shopdeploy
```

---

## 🏗 DevOps Infrastructure

### Infrastructure Provisioning (Terraform)

```bash
cd terraform

# Initialize Terraform
./scripts/terraform-init.sh prod

# Plan changes
terraform plan

# Apply infrastructure
terraform apply

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name shopdeploy-prod-eks
```

### CI/CD Pipeline (Jenkins)

The project includes a comprehensive Jenkins pipeline that:

1. **Checkout** - Clones the repository
2. **Install Dependencies** - Runs `npm ci`
3. **Code Quality** - Linting and security scanning
4. **Test** - Unit tests with coverage
5. **Build** - Multi-stage Docker builds
6. **Push** - Push images to ECR
7. **Deploy** - Helm deployment to EKS
8. **Smoke Tests** - Post-deployment verification

### Monitoring Setup

```bash
# Install monitoring stack
./monitoring/install-monitoring.sh

# Access Grafana
kubectl port-forward svc/grafana 3000:80 -n monitoring

# Access Prometheus
kubectl port-forward svc/prometheus-server 9090:80 -n monitoring
```

---

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Cart Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:itemId` | Update cart item |
| DELETE | `/api/cart/:itemId` | Remove cart item |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id/status` | Update order status (Admin) |

### Health Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health/health` | Liveness check |
| GET | `/api/health/ready` | Readiness check |

---

## ⚙️ Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shopdeploy

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Project Repository**: [GitHub](https://github.com/yourusername/shopdeploy)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [Kubernetes](https://kubernetes.io/)
- [Terraform](https://www.terraform.io/)
- [AWS Documentation](https://docs.aws.amazon.com/)

---

<p align="center">
  <b>⭐ Star this repository if you found it helpful!</b>
</p>

<p align="center">
  Made with ❤️ by the ShopDeploy Team
</p>
