import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.qty, 0) || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            ShopDeploy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-primary-600">
                  Orders
                </Link>
                
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
                  <FiShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                  <FiUser size={24} />
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 flex items-center space-x-1"
                >
                  <FiLogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <FiMenu size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/products" className="block py-2 text-gray-700">
              Products
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="block py-2 text-gray-700">
                  Orders
                </Link>
                <Link to="/cart" className="block py-2 text-gray-700">
                  Cart ({cartItemsCount})
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700">
                  Profile
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block py-2 text-gray-700">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block py-2 text-red-600 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-700">
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-gray-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
