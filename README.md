# 🛒 ShopDeploy - MERN E-Commerce Application

A complete full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring authentication, cart management, checkout flow, order tracking, and an admin dashboard.

## � Docker Ready

**Fully containerized application ready for deployment!**

- 🐳 **Docker Compose**: One-command deployment for both frontend and backend
- 🔧 **Multi-stage Builds**: Optimized production images
- 🏥 **Health Checks**: Built-in container health monitoring
- 🌐 **Nginx**: Production-ready frontend serving with gzip compression
- 🔒 **Security**: Non-root containers, security headers

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Docker Deployment](#-docker-deployment)
- [Kubernetes Deployment](#-kubernetes-deployment)
- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- 🔐 User authentication with JWT (Access + Refresh Tokens)
- 🛍️ Browse products with search, filters, pagination, and sorting
- 📦 Detailed product pages with image carousel and stock visibility
- 🛒 Shopping cart with add/remove/update functionality (persisted in database)
- 💳 Complete checkout flow with shipping address
- 📱 Order history and order tracking
- 👤 User profile management
- 🔒 Secure password hashing with bcrypt

### Admin Features
- 📊 Admin dashboard with statistics
- ➕ Product CRUD operations with image upload
- 📂 Category management
- 📋 Order management with status updates
- 👥 User management with role updates
- 🖼️ Local file storage for images

### Technical Features
- 🔄 Token-based authentication with automatic refresh
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS
- 🔔 Real-time notifications with react-hot-toast
- 🛡️ Role-based access control
- ✅ Request validation and error handling
- 🗄️ MongoDB with Mongoose ODM

## 🧰 Tech Stack

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Vite** - Build tool
- **React Hot Toast** - Notifications
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload
- **Stripe** - Payment processing (optional)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Kubernetes** - Container orchestration
- **Nginx** - Frontend web server
- **Kustomize** - Kubernetes configuration management

## 🐳 Docker Deployment

### Prerequisites

- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)
- **MongoDB** - Running locally, via Docker, or MongoDB Atlas

### Quick Start with Docker Compose

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "ShopDeploy-E-Commerce Application"
```

#### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

**Required environment variables:**
```env
MONGODB_URI=mongodb://host.docker.internal:27017/shopdeploy
JWT_ACCESS_SECRET=your_secure_access_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
VITE_API_URL=http://localhost:5000/api
```

#### 3. Build and Run

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Remove containers and volumes
docker-compose down -v
```

### Building Individual Images

#### Backend Image

```bash
cd shopdeploy-backend

# Build the image
docker build -t shopdeploy-backend:latest .

# Run the container
docker run -d \
  --name shopdeploy-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/shopdeploy \
  -e JWT_ACCESS_SECRET=your_secret \
  -e JWT_REFRESH_SECRET=your_secret \
  -e FRONTEND_URL=http://localhost:3000 \
  shopdeploy-backend:latest
```

#### Frontend Image

```bash
cd shopdeploy-frontend

# Build the image
docker build -t shopdeploy-frontend:latest .

# Run the container
docker run -d \
  --name shopdeploy-frontend \
  -p 3000:80 \
  shopdeploy-frontend:latest
```

### Push to Docker Registry

#### Docker Hub

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag shopdeploy-backend:latest yourusername/shopdeploy-backend:latest
docker tag shopdeploy-frontend:latest yourusername/shopdeploy-frontend:latest

# Push images
docker push yourusername/shopdeploy-backend:latest
docker push yourusername/shopdeploy-frontend:latest
```

#### Private Registry

```bash
# Tag for private registry
docker tag shopdeploy-backend:latest registry.example.com/shopdeploy-backend:latest
docker tag shopdeploy-frontend:latest registry.example.com/shopdeploy-frontend:latest

# Push to private registry
docker push registry.example.com/shopdeploy-backend:latest
docker push registry.example.com/shopdeploy-frontend:latest
```

### Production Deployment Tips

1. **Use specific version tags** instead of `latest` for production
2. **Set up proper secrets management** for sensitive environment variables
3. **Configure reverse proxy** (Nginx/Traefik) for SSL termination
4. **Set resource limits** in docker-compose for production:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

### Health Checks

Both containers include health checks:

- **Backend**: `GET /api/health` on port 5000
- **Frontend**: HTTP check on port 80

```bash
# Check container health status
docker ps
docker inspect --format='{{.State.Health.Status}}' shopdeploy-backend
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, Docker Desktop, EKS, GKE, AKS, etc.)
- kubectl configured to connect to your cluster
- Docker images built and pushed to a registry

### Quick Start

#### 1. Build and Push Docker Images

```bash
# Build images
docker build -t shopdeploy-backend:latest ./shopdeploy-backend
docker build -t shopdeploy-frontend:latest ./shopdeploy-frontend

# Tag for your registry (example with Docker Hub)
docker tag shopdeploy-backend:latest yourusername/shopdeploy-backend:latest
docker tag shopdeploy-frontend:latest yourusername/shopdeploy-frontend:latest

# Push to registry
docker push yourusername/shopdeploy-backend:latest
docker push yourusername/shopdeploy-frontend:latest
```

#### 2. Configure Secrets

Edit `k8s/backend-secret.yaml` with your actual values or create secrets via kubectl:

```bash
kubectl create secret generic backend-secrets \
  --namespace=shopdeploy \
  --from-literal=MONGODB_URI='mongodb://...' \
  --from-literal=JWT_ACCESS_SECRET='your-secret' \
  --from-literal=JWT_REFRESH_SECRET='your-secret'
```

#### 3. Deploy to Kubernetes

```bash
# Using Kustomize (Recommended)
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

### Kubernetes Commands

```bash
# Check deployment status
kubectl get all -n shopdeploy

# View pods
kubectl get pods -n shopdeploy

# View logs
kubectl logs -f deployment/backend -n shopdeploy

# Port forward for local testing
kubectl port-forward svc/backend-service 5000:5000 -n shopdeploy
kubectl port-forward svc/frontend-service 3000:80 -n shopdeploy

# Scale deployments
kubectl scale deployment backend --replicas=3 -n shopdeploy

# Delete all resources
kubectl delete -k k8s/
```

### Kubernetes Features

- **Namespace**: Isolated `shopdeploy` namespace
- **ConfigMaps & Secrets**: Externalized configuration
- **Deployments**: Backend (2 replicas) and Frontend (2 replicas)
- **Services**: ClusterIP services for internal communication
- **Ingress**: Nginx ingress with routing rules
- **MongoDB StatefulSet**: Persistent MongoDB with PVC
- **HPA**: Auto-scaling (2-10 pods) based on CPU/memory
- **Health Checks**: Liveness and readiness probes

See [k8s/README.md](k8s/README.md) for detailed Kubernetes documentation.

## 💻 Local Development

## 📁 Project Structure

```
ShopDeploy-E-Commerce Application/
│
├── shopdeploy-backend/           # Backend API
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Custom middleware
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   ├── app.js               # Express app
│   │   └── server.js            # Server entry
│   ├── uploads/                 # File uploads
│   ├── package.json
│   └── README.md
│
└── shopdeploy-frontend/          # Frontend application
    ├── src/
    │   ├── api/                 # API services
    │   ├── app/                 # Redux store
    │   ├── components/          # Reusable components
    │   ├── features/            # Redux slices
    │   ├── layouts/             # Layout components
    │   ├── pages/               # Page components
    │   ├── routes/              # Route config
    │   └── utils/               # Helper functions
    ├── public/                  # Static assets
    ├── package.json
    └── README.md
```

## 📦 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas account
- **npm** or **yarn**
- **Stripe Account** (optional, for payments)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "ShopDeploy-E-Commerce Application"
```

### 2. Backend Setup

```bash
cd shopdeploy-backend
npm install
```

Create `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/shopdeploy

# JWT Secrets (use strong random strings)
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Stripe (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../shopdeploy-frontend
npm install
```

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod
```

### Start Backend Server

```bash
cd shopdeploy-backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Application

```bash
cd shopdeploy-frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/refresh-token` | Refresh access token | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Product Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get product by ID | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Category Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Cart Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user cart | Private |
| POST | `/api/cart` | Add item to cart | Private |
| PUT | `/api/cart/:itemId` | Update cart item | Private |
| DELETE | `/api/cart/:itemId` | Remove from cart | Private |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create order | Private |
| GET | `/api/orders` | Get user orders | Private |
| GET | `/api/orders/all` | Get all orders | Admin |
| GET | `/api/orders/:id` | Get order by ID | Private |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

## 🔐 User Roles

### Customer
- Browse and search products
- Add items to cart
- Place orders
- View order history
- Manage profile

### Admin
- All customer features
- Create/Edit/Delete products
- Manage categories
- Update order status
- View all orders and users
- Access admin dashboard

## 🌟 Key Features Explained

### Authentication Flow
1. User registers/logs in
2. Server generates access token (15min) and refresh token (7 days)
3. Tokens stored in localStorage and httpOnly cookies
4. Access token used for API requests
5. Automatic token refresh when expired

### Shopping Cart
- Cart persists in MongoDB for logged-in users
- Real-time updates
- Stock validation
- Price snapshot at time of adding

### Checkout Process
1. Review cart items
2. Enter shipping address
3. Select payment method
4. Place order
5. Stock automatically reduced
6. Order confirmation

### Admin Dashboard
- Product management with image upload
- Order status tracking
- Statistics overview
- User management

## 🛠️ Development

### Backend Development
```bash
cd shopdeploy-backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd shopdeploy-frontend
npm run dev  # Vite dev server with HMR
```

### Build for Production

**Backend:**
```bash
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `CLOUDINARY_*` - Cloudinary credentials
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `STRIPE_SECRET_KEY` - Stripe API key
- `FRONTEND_URL` - Frontend URL for CORS

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**ShopDeploy Team**

## 🙏 Acknowledgments
## 🙏 Acknowledgments

- MongoDB for the database
- Tailwind CSS for the styling framework
- Redux Toolkit for state management
## 📧 Support

For support, email support@shopdeploy.com or open an issue in the repository.

---

**Happy Shopping! 🛍️**
