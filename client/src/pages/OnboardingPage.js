import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './OnboardingPage.css';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // We need two separate state arrays now
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  const navigate = useNavigate();
  const { user, reloadUser } = useContext(AuthContext);

  // 1. --- FETCH ALL SKILLS FROM THE BACKEND ---
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('/skills');
        setAllSkills(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch skills", err);
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // 2. --- HANDLER FOR THE "TEACH" LIST ---
  const handleTeachSkillToggle = (skillId) => {
    setSkillsToTeach((prev) => 
      prev.includes(skillId) 
        ? prev.filter((id) => id !== skillId) 
        : [...prev, skillId]
    );
  };

  // 3. --- HANDLER FOR THE "LEARN" LIST ---
  const handleLearnSkillToggle = (skillId) => {
    setSkillsToLearn((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  // 4. --- FINAL SUBMISSION LOGIC ---
  const handleSubmit = async () => {
    if (skillsToTeach.length === 0 || skillsToLearn.length === 0) {
      alert('Please select at least one skill to teach and one skill to learn.');
      return;
    }
    try {
      // Use the correct endpoint from our userRoutes.js
      await axios.put('/users/skills', {
        skillsToTeach,
        skillsToLearn,
      });
      // reloadUser updates the context with the new skills
      await reloadUser(); 
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save your profile. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="onboarding-container"><div className="onboarding-card"><h2>Loading Skills...</h2></div></div>;
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* --- STEP 1: Skills to Teach --- */}
        {step === 1 && (
          <div className="step active">
            <h2><i className="fas fa-chalkboard-teacher"></i> What skills can you teach?</h2>
            <p>Select all skills you are confident in teaching to others. This will help learners find you.</p>
            <div className="skills-grid">
              {allSkills.map((skill) => (
                <div
                  key={skill._id}
                  className={`skill-checkbox ${skillsToTeach.includes(skill._id) ? 'selected' : ''}`}
                  onClick={() => handleTeachSkillToggle(skill._id)}
                >
                  {skill.name}
                </div>
              ))}
            </div>
            <div className="onboarding-actions">
              <span /> {/* Empty span for spacing */}
              <button className="finish-button" onClick={() => setStep(2)}>Next Step</button>
            </div>
          </div>
        )}

        {/* --- STEP 2: Skills to Learn --- */}
        {step === 2 && (
          <div className="step active">
            <h2><i className="fas fa-book-reader"></i> What do you want to learn?</h2>
            <p>Select the skills you are interested in learning. We'll use this to help you find mentors.</p>
            <div className="skills-grid">
              {allSkills.map((skill) => (
                <div
                  key={skill._id}
                  className={`skill-checkbox ${skillsToLearn.includes(skill._id) ? 'selected' : ''}`}
                  onClick={() => handleLearnSkillToggle(skill._id)}
                >
                  {skill.name}
                </div>
              ))}
            </div>
            <div className="onboarding-actions">
              <button className="back-button" onClick={() => setStep(1)}>Back</button>
              <button className="finish-button" onClick={handleSubmit}>Finish & Go to Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;