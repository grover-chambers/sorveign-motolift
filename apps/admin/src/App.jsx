import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Applications from './pages/Applications.jsx';
import ApplicationDetail from './pages/ApplicationDetail.jsx';
import Riders from './pages/Riders.jsx';
import RiderDetail from './pages/RiderDetail.jsx';
import Payments from './pages/Payments.jsx';
import Bikes from './pages/Bikes.jsx';
import Reports from './pages/Reports.jsx';
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
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (u, token) => {
    setUser(u);
    localStorage.setItem('admin_user', JSON.stringify(u));
    localStorage.setItem('admin_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
  };

  const toggleSidebar = () => setSidebarOpen(o => !o);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        {user && <Sidebar open={sidebarOpen} onToggle={toggleSidebar} />}
        <div className={user ? (sidebarOpen ? 'main-content' : 'main-content collapsed') : ''}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/applications/:id" element={<ProtectedRoute><ApplicationDetail /></ProtectedRoute>} />
            <Route path="/riders" element={<ProtectedRoute><Riders /></ProtectedRoute>} />
            <Route path="/riders/:id" element={<ProtectedRoute><RiderDetail /></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
            <Route path="/bikes" element={<ProtectedRoute><Bikes /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
