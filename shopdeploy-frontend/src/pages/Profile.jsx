import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiShield } from 'react-icons/fi';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4">
              <FiUser className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-primary-100">{user.email}</p>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <FiUser className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-gray-900 font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiMail className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FiShield className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="text-gray-900 font-medium capitalize">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Customer
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-5 h-5 text-gray-400 mt-1 mr-3 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-1">My Orders</h3>
            <p className="text-sm text-gray-600">View your order history and track shipments</p>
          </Link>
          
          <Link
            to="/cart"
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Shopping Cart</h3>
            <p className="text-sm text-gray-600">Review items in your cart</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
