import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './ProfilePage.css'; // Your CSS is great and will support this too

const ProfilePage = () => {
  const { user, reloadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State to toggle between viewing and editing
  const [isEditMode, setIsEditMode] = useState(false);
  
  // State for the form data
  const [allSkills, setAllSkills] = useState([]);
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [loading, setLoading] = useState(false);

  // When the component loads, or when the user object changes, set the initial skills
  useEffect(() => {
    if (user) {
      setSkillsToTeach(user.skillsToTeach.map(skill => skill._id));
      setSkillsToLearn(user.skillsToLearn.map(skill => skill._id));
    }
  }, [user]);

  // Handler for entering edit mode
  const handleEdit = async () => {
    setIsEditMode(true);
    // Fetch all skills only when the user decides to edit
    try {
      setLoading(true);
      const res = await axios.get('/skills');
      setAllSkills(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch skills", err);
      setLoading(false);
    }
  };

  // Handlers for skill selection (same as onboarding)
  const handleTeachSkillToggle = (skillId) => {
    setSkillsToTeach(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
  };

  const handleLearnSkillToggle = (skillId) => {
    setSkillsToLearn(prev => prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]);
  };

  // Handler for saving the form
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put('/users/skills', {
        skillsToTeach,
        skillsToLearn,
      });
      await reloadUser(); // Crucial to update the context
      setIsEditMode(false); // Exit edit mode
    } catch (err) {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return <div className="loading-text">Loading Profile...</div>;
  }

  // --- RENDER THE EDITING VIEW ---
  if (isEditMode) {
    return (
      <div className="profile-page-content">
        <h1 className="profile-title"><i className="fas fa-edit"></i> Edit Your Skills</h1>
        <div className="profile-card">
          {loading ? (
            <p>Loading skills...</p>
          ) : (
            <>
              <div className="profile-section">
                <h3>My Skills to Teach</h3>
                <div className="skills-tags-profile edit-mode">
                  {allSkills.map(skill => (
                    <div key={skill._id}
                         className={`skill-checkbox ${skillsToTeach.includes(skill._id) ? 'selected' : ''}`}
                         onClick={() => handleTeachSkillToggle(skill._id)}>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="profile-section">
                <h3>Skills I Want to Learn</h3>
                <div className="skills-tags-profile edit-mode">
                  {allSkills.map(skill => (
                    <div key={skill._id}
                         className={`skill-checkbox ${skillsToLearn.includes(skill._id) ? 'selected' : ''}`}
                         onClick={() => handleLearnSkillToggle(skill._id)}>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="profile-actions">
                <button className="back-button" onClick={() => setIsEditMode(false)}>Cancel</button>
                <button className="finish-button" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER THE VIEWING-ONLY VIEW ---
  return (
    <div className="profile-page-content">
      <h1 className="profile-title"><i className="fas fa-user-circle"></i> My Profile</h1>
      <div className="profile-card">
        <div className="profile-section">
          <h3>Account Details</h3>
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">SkillMoney Balance</span>
            <span className="detail-value accent">{user.skillMoney} Coins</span>
          </div>
        </div>
        
        <div className="profile-section">
          <h3>My Skills to Teach</h3>
          <div className="skills-tags-profile">
            {user.skillsToTeach && user.skillsToTeach.length > 0 ? (
              user.skillsToTeach.map(skill => <span key={skill._id} className="skill-tag">{skill.name}</span>)
            ) : <p className="detail-value">No skills selected yet.</p>}
          </div>
        </div>

        <div className="profile-section">
          <h3>Skills I Want to Learn</h3>
          <div className="skills-tags-profile">
            {user.skillsToLearn && user.skillsToLearn.length > 0 ? (
              user.skillsToLearn.map(skill => <span key={skill._id} className="skill-tag learn">{skill.name}</span>)
            ) : <p className="detail-value">No skills selected yet.</p>}
          </div>
        </div>

        <div className="profile-actions">
            <button className="finish-button" onClick={handleEdit}>Edit My Skills</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;