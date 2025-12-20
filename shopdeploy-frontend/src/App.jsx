import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import { getCurrentUser } from './features/auth/authSlice';
import { fetchCart } from './features/cart/cartSlice';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      store.dispatch(getCurrentUser());
      store.dispatch(fetchCart());
    }
  }, []);

  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
