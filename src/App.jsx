import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>;
  return user ? children : <Navigate to="/" />;
};

function AppRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LoginRegister />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
