import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// --- Set the base URL for all axios requests ---
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  const reloadUser = useCallback(async () => {
    if (token) {
      setAuthToken(token);
      try {
        // --- The URL is now much cleaner ---
        const res = await axios.get('/auth/me'); 
        setUser(res.data);
      } catch (err) {
        console.error('Failed to reload user', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
  }, [token]);


  useEffect(() => {
    const loadInitialUser = async () => {
      if (token) {
        await reloadUser();
      }
      setLoading(false);
    };
    loadInitialUser();
  }, [token, reloadUser]);

  const login = async (email, password) => {
    // --- The URL is now much cleaner ---
    const res = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token); // This will trigger the useEffect to reload the user
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    token,
    user,
    loading,
    login,
    logout,
    reloadUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;