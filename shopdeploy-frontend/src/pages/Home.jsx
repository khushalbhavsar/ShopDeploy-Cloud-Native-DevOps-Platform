import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiDollarSign, FiShield } from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: FiShoppingBag,
      title: 'Wide Selection',
      description: 'Thousands of products across multiple categories',
    },
    {
      icon: FiTruck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over ₹500',
    },
    {
      icon: FiDollarSign,
      title: 'Best Prices',
      description: 'Competitive prices with regular deals',
    },
    {
      icon: FiShield,
      title: 'Secure Shopping',
      description: 'Safe and secure payment methods',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to ShopDeploy
            </h1>
            <p className="text-xl mb-8">
              Your one-stop destination for quality products at great prices
            </p>
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Shop With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers today
          </p>
          <Link
            to="/register"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
