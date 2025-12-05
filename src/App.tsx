import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransferPage from './pages/TransferPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; 

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth(); 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; 
};

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ProtectedRoute />}> 
            
            <Route path="/dashboard" element={<DashboardPage />} />
            
            <Route path="/transfer" element={<TransferPage />} />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/profile" element={<UserProfilePage />} />
            
        </Route>

        <Route path="*" element={<div>404 - Pagina Non Trovata</div>} />
        
      </Routes>
    </>
  );
};

export default App;