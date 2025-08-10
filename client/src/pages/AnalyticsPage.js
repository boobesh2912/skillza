import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnalyticsPage.css';

// A reusable StatCard component for a cleaner look
const StatCard = ({ value, label, icon, color }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div className="stat-icon">
      <i className={icon}></i>
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
        // Set analytics to a default error state if fetching fails
        setAnalytics({
          coinsEarned: 'N/A',
          peopleTaught: 'N/A',
          coinsSpent: 'N/A',
          skillsLearned: 'N/A',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="loading-text">Calculating Your Stats...</div>;
  }

  return (
    <div className="analytics-page-content">
      <div className="analytics-header">
        <h1 className="analytics-title">
          <i className="fas fa-chart-line"></i> Your Analytics
        </h1>
        <p className="analytics-subtitle">
          Track your journey as both a teacher and a learner on SkillSwap.
        </p>
      </div>
      <div className="analytics-grid">
        <StatCard
          value={analytics.coinsEarned}
          label="Coins Earned"
          icon="fas fa-coins"
          color="var(--success)"
        />
        <StatCard
          value={analytics.coinsSpent}
          label="Coins Spent"
          icon="fas fa-shopping-cart"
          color="var(--error)"
        />
        <StatCard
          value={analytics.peopleTaught}
          label="Students Taught"
          icon="fas fa-chalkboard-teacher"
          color="var(--primary)"
        />
        <StatCard
          value={analytics.skillsLearned}
          label="Skills Learned"
          icon="fas fa-brain"
          color="var(--accent)"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;