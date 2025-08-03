import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { updateUserLastActive } from '../api';

const isAuthenticated = () => {
  return !!localStorage.getItem('userEmail');
};

const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (isAuthenticated() && userId) {
      // updateUserLastActive(userId);
    }
  }, [userId]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;