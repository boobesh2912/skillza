import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // This logic is now safe because the user object will be fresh
    if (user && user.skillsToTeach && user.skillsToTeach.length === 0) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const cardStyle = {
    background: 'var(--bg-card)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid var(--border)',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '5rem auto',
    boxShadow: 'var(--shadow)',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '1rem',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'white',
    marginTop: '2rem',
    transition: 'transform 0.2s ease',
  };

    if (loading) return <div className="loading-text">Loading Mentors...</div>;

  return (
    <>
      <div className="discover-page-content">
        {/* --- FILTERS JSX --- */}
        <div className="card filters-card">
          <h3><i className="fas fa-filter"></i> Find the Perfect Mentor</h3>
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="category-filter">Filter by Category</label>
              <select id="category-filter" className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="skill-filter">Filter by Skill</label>
              <select id="skill-filter" className="filter-select" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)}>
                <option value="all">All Skills</option>
                {allSkills.map(skill => <option key={skill._id} value={skill.name}>{skill.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- USER CARDS JSX --- */}
        <div className="user-cards-grid">
          {filteredMentors.length > 0 ? (
            filteredMentors.map(mentor => (
              <div key={mentor._id} className="user-card">
                <div className="user-header">
                  <div className="user-info-card">
                    <h4>{mentor.name}</h4>
                    <p className="user-meta">Available: {mentor.availability?.join(', ') || 'Not specified'}</p>
                  </div>
                  <div className="rating">
                    <i className="fas fa-star"></i> 5.0
                  </div>
                </div>
                <div className="skills-tags">
                  {mentor.skillsToTeach.map(skill => (
                    <span key={skill._id} className="skill-tag">{skill.name}</span>
                  ))}
                </div>
                <button className="connect-btn" onClick={() => openRequestModal(mentor)}>
                  <i className="fas fa-paper-plane"></i> Connect
                </button>
              </div>
            ))
          ) : (
            <div className="no-results-card">
              <p>No mentors found matching your criteria. Try adjusting the filters!</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeRequestModal}>
        {/* Your existing modal code is perfect and does not need to be changed */}
        {selectedMentor && (
          <form onSubmit={handleRequestSubmit} className="request-form">
            <h2>Request a Session with {selectedMentor.name}</h2>
            <div className="form-group"><label>Skill to learn</label><select className="filter-select" value={requestSkillId} onChange={(e) => setRequestSkillId(e.target.value)}>{selectedMentor.skillsToTeach.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
            <div className="form-group">
              <label>How many SkillMoney coins do you offer for this session?</label>
              <input type="number" className="filter-select" value={sessionCost} onChange={(e) => setSessionCost(Number(e.target.value))} min="1"/>
            </div>
            <div className="form-group"><label>Your Message</label><textarea placeholder={`Hi ${selectedMentor.name}, I'd love to learn...`} rows="4" value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} required></textarea></div>
            <button type="submit" className="connect-btn">Send Request & Spend {sessionCost} Coins</button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default DashboardPage;