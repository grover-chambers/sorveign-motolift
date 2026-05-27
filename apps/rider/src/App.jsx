import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Payments from './pages/Payments.jsx';
import Bike from './pages/Bike.jsx';
import Support from './pages/Support.jsx';
import Platforms from './pages/Platforms.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Activate from './pages/Activate.jsx';
import { api } from './api.js';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export { api };

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rider_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (u, token) => {
    setUser(u);
    localStorage.setItem('rider_user', JSON.stringify(u));
    localStorage.setItem('rider_token', token);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('rider_user');
    localStorage.removeItem('rider_token');
  };

  const showNav = user && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/activate');

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/activate" element={<Activate />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/bike" element={<ProtectedRoute><Bike /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/platforms" element={<ProtectedRoute><Platforms /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {showNav && <BottomNav />}
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
