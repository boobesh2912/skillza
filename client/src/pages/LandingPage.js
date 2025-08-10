import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // We will create this next

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <i className="fas fa-exchange-alt"></i> SkillSwap
        </div>
        <div className="nav-buttons">
          {/* This button will navigate to our login/register page */}
          <button className="btn btn-primary" onClick={() => navigate('/auth')}>
            <i className="fas fa-sign-in-alt"></i> Login / Register
          </button>
        </div>
      </header>
      
      <div className="hero">
        <h1>Learn by Teaching</h1>
        <p>Exchange skills, earn SS Coins, and grow together in our collaborative learning community.</p>
        <button className="btn btn-primary btn-large" onClick={() => navigate('/auth')}>
          <i className="fas fa-rocket"></i> Start Your Journey
        </button>
      </div>

      {/* This is a decorative background element */}
      <div className="background-shapes"></div>
    </div>
  );
};

export default LandingPage;