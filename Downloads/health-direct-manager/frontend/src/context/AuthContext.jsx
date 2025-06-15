import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate token on initial load
  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          // Replace with actual API call to validate token if your backend supports it
          // For now, we'll assume token is valid if it exists
          // Example: await api.get('/auth/validate-token');
          setIsLoading(false);
        } catch (error) {
          console.error('Token validation failed:', error);
          logout();
        }
      } else {
        setIsLoading(false);
      }
    };
    validateToken();
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/manager-dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/manager-signin');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};