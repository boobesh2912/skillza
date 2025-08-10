import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);

  const getPrimaryCategory = () => {
    if (!user || !user.skillsToTeach || user.skillsToTeach.length === 0) return 'New Member';
    return user.skillsToTeach[0].category + ' Expert';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-info">
          <h1>Welcome back, {user?.name}!</h1>
          <p>{getPrimaryCategory()}</p>
        </div>
        <div className="header-actions">
          <div className="balance"><i className="fas fa-coins"></i><span>{user?.skillMoney}</span> SS Coins</div>
          <button className="logout-btn" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </header>
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end><i className="fas fa-search"></i> Discover</NavLink>
        <NavLink to="/dashboard/requests"><i className="fas fa-inbox"></i> Teaching Requests</NavLink>
        <NavLink to="/dashboard/analytics"><i className="fas fa-chart-bar"></i> Analytics</NavLink> {/* <-- Add Analytics NavLink */}
        <NavLink to="/dashboard/profile"><i className="fas fa-user"></i> Profile</NavLink>
      </nav>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;