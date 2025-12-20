import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';

const ProductCard = ({ product, onAddToCart }) => {
  const mainImage = product.images?.[0]?.url || 'https://via.placeholder.com/300';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-64 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600 mb-2">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 ? (
            <span className="text-sm text-green-600">In Stock</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product._id)}
          disabled={product.stock === 0}
          className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <FiShoppingCart />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
