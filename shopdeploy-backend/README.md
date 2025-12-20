# ShopDeploy Backend API

E-Commerce REST API built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** (JWT with Access & Refresh Tokens)
- **Product Management** (CRUD operations with image upload)
- **Category Management**
- **Shopping Cart** (Persistent cart in database)
- **Order Management** (Complete checkout flow)
- **User Roles** (Customer & Admin)
- **Payment Integration** (Stripe support)
- **Image Upload** (Local file storage)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Stripe account (optional, for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd shopdeploy-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/shopdeploy

   # JWT Secrets (generate strong secrets)
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret

   # Stripe (Optional)
   STRIPE_SECRET_KEY=your_stripe_key

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create uploads directory**
   ```bash
   mkdir uploads
   ```

## 🏃 Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:5000`

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
| GET | `/api/products` | Get all products (with filters) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Category Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get single category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Cart Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cart` | Get user cart | Private |
| POST | `/api/cart` | Add item to cart | Private |
| PUT | `/api/cart/:itemId` | Update cart item quantity | Private |
| DELETE | `/api/cart/:itemId` | Remove item from cart | Private |
| DELETE | `/api/cart` | Clear cart | Private |

### Order Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/orders` | Create new order | Private |
| GET | `/api/orders` | Get user orders | Private |
| GET | `/api/orders/all` | Get all orders | Admin |
| GET | `/api/orders/:id` | Get single order | Private |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

## 🗄️ Database Models

- **User** - User accounts with authentication
- **Product** - Product catalog with images
- **Category** - Product categories
- **Cart** - Shopping cart with items
- **Order** - Customer orders with status tracking

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) with two-token strategy:
- **Access Token** (15 minutes) - For API requests
- **Refresh Token** (7 days) - To get new access tokens

Tokens can be sent via:
- Authorization header: `Authorization: Bearer <token>`
- HTTP-only cookies (recommended)

## 📦 Project Structure

```
shopdeploy-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # Local file uploads
├── .env                 # Environment variables
├── .env.example         # Environment template
└── package.json
```

## 🧪 Testing

Use tools like Postman or Thunder Client to test the API.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

ISC

## 👥 Author

ShopDeploy Team

## 🐛 Issues

Report issues at the project's issue tracker.
