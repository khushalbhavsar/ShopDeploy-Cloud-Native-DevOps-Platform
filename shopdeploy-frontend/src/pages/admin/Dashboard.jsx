import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const Dashboard = () => {
  // Mock data - in real app, fetch from API
  const stats = [
    { icon: FiPackage, label: 'Total Products', value: '150', color: 'bg-blue-500' },
    { icon: FiShoppingBag, label: 'Total Orders', value: '1,234', color: 'bg-green-500' },
    { icon: FiUsers, label: 'Total Users', value: '567', color: 'bg-purple-500' },
    { icon: FiDollarSign, label: 'Total Revenue', value: '₹2,45,678', color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-600">Dashboard overview and analytics coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
