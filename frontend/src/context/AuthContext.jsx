import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as logoutAuth, getMe } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('skillgap_token');
      if (token) {
        try {
          const res = await getMe();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('skillgap_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to sync auth session:', err);
          logoutAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginSuccess = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutAuth();
    setUser(null);
  };

  const updateUserTargetRole = (targetRoleObj) => {
    if (user) {
      const updatedUser = { ...user, targetRole: targetRoleObj };
      setUser(updatedUser);
      localStorage.setItem('skillgap_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loginSuccess,
        logout,
        updateUserTargetRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
