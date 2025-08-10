import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // We will use axios directly for registration
import AuthContext from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get login function and user status from our global context
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If a user is already logged in, redirect them away from this page
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        await login(email, password);
        // The useEffect will redirect to /dashboard
        // This part remains the same.
        
      } else {
        // --- NEW & IMPROVED REGISTRATION LOGIC ---

        // 1. Register the user
        await axios.post('/auth/register', { name, email, password });
        
        // 2. Automatically log them in with the same credentials
        await login(email, password);

        // 3. Manually navigate them to the onboarding page
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>
          <i className={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}></i>
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={onSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={name} onChange={onChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required minLength="6" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button" disabled={loading}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;