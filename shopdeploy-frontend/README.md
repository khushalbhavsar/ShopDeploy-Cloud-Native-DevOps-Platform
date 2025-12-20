# ShopDeploy Frontend

React-based e-commerce frontend application built with Vite, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX** with Tailwind CSS
- **State Management** with Redux Toolkit
- **Authentication** with JWT tokens
- **Shopping Cart** functionality
- **Checkout Process** with order placement
- **Admin Dashboard** for product and order management
- **Responsive Design** for all devices
- **Protected Routes** for authenticated users

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see shopdeploy-backend)

## 🛠️ Installation

1. **Navigate to frontend directory**
   ```bash
   cd shopdeploy-frontend
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

   Update the environment variable:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

## 🏃 Running the Application

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

The application will start at `http://localhost:5173`

## 📁 Project Structure

```
shopdeploy-frontend/
├── src/
│   ├── api/              # API service functions
│   ├── app/              # Redux store configuration
│   ├── components/       # Reusable components
│   ├── features/         # Redux slices
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── routes/           # Route configuration
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # App entry point
├── public/               # Static assets
└── package.json
```

## 🎨 Pages

### Public Pages
- **Home** - Landing page with featured products
- **Products** - Product listing with filters and search
- **Product Details** - Individual product page
- **Login** - User authentication
- **Register** - New user registration

### Protected Pages
- **Cart** - Shopping cart management
- **Checkout** - Order placement
- **Profile** - User profile and order history

### Admin Pages
- **Dashboard** - Admin overview
- **Manage Products** - Product CRUD operations
- **Manage Orders** - Order management and status updates
- **Manage Users** - User management

## 🔐 Authentication

The app uses JWT tokens stored in localStorage:
- Access token for API requests
- Refresh token for token renewal
- Automatic token refresh on expiration
- Protected routes with authentication checks

## 🎯 State Management

Redux Toolkit slices:
- **authSlice** - User authentication state
- **productSlice** - Product data and operations
- **cartSlice** - Shopping cart management

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Responsive Design** with mobile-first approach
- **Custom Color Palette** with primary brand colors
- **Icons** from react-icons

## 📦 Key Dependencies

- **react** - UI library
- **react-redux** - State management
- **@reduxjs/toolkit** - Redux utilities
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **react-hot-toast** - Notifications
- **react-icons** - Icon library

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

Build the application:
```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, etc.).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📝 License

ISC

## 👥 Author

ShopDeploy Team
