import './bootstrap';
import React, { useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useThemeStore, useAuthStore } from './store/appStore';
import axios from 'axios';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/ui/ToastContainer';
import LoadingScreen from './components/ui/LoadingScreen';
import Watermark from './components/ui/Watermark';

// Lazy-load pages for performance
const Home = lazy(() => import('./Pages/Home'));
const Collections = lazy(() => import('./Pages/Collections'));
const ConfiguratorShow = lazy(() => import('./Pages/Configurator/Show'));
const Auth = lazy(() => import('./Pages/Auth'));
const Dashboard = lazy(() => import('./Pages/Dashboard'));
const Gallery = lazy(() => import('./Pages/Gallery'));
const Profile = lazy(() => import('./Pages/Profile'));
const SharedDesign = lazy(() => import('./Pages/SharedDesign'));
const NotFound = lazy(() => import('./Pages/NotFound'));
const Cart = lazy(() => import('./Pages/Cart'));
const Checkout = lazy(() => import('./Pages/Checkout'));
const Admin = lazy(() => import('./Pages/Admin'));

function App() {
  const initTheme = useThemeStore(s => s.initTheme);
  const setUser = useAuthStore(s => s.setUser);
  const setLoading = useAuthStore(s => s.setLoading);

  useEffect(() => {
    initTheme();
    // Check auth status on mount
    axios.get('/api/auth/me')
      .then(res => {
        if (res.data.success) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Watermark />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/configure/:id" element={<ConfiguratorShow />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shared/:token" element={<SharedDesign />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById('app');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
