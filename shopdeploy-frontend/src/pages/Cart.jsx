import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../features/cart/cartSlice';
import { formatPrice } from '../utils/helpers';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQty = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await dispatch(updateCartItem({ itemId, qty: newQty })).unwrap();
    } catch (error) {
      toast.error(error || 'Failed to update quantity');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.productId?.images?.[0]?.url || 'https://via.placeholder.com/100'}
                  alt={item.productId?.title}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.productId?.title}
                  </h3>
                  <p className="text-gray-600">{formatPrice(item.priceAtAdd)}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQty(item._id, item.qty, -1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center">{item.qty}</span>
                  <button
                    onClick={() => handleUpdateQty(item._id, item.qty, 1)}
                    className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(item.priceAtAdd * item.qty)}
                </div>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(cart.totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {cart.totalPrice > 500 ? 'FREE' : formatPrice(50)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.totalPrice + (cart.totalPrice > 500 ? 0 : 50))}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
