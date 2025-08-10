import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import AuthContext from '../context/AuthContext';
import './DiscoverPage.css';

const DiscoverPage = () => {
  const [mentors, setMentors] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSkillId, setRequestSkillId] = useState('');

  // --- NEW: State for user-defined coin cost ---
  const [sessionCost, setSessionCost] = useState(20);

  const { user, reloadUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, skillsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/skills'),
        ]);
        setMentors(usersRes.data);
        setAllSkills(skillsRes.data);
        setLoading(false);
      } catch (err) { console.error('Failed to fetch initial data', err); setLoading(false); }
    };
    fetchInitialData();
  }, []);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const categoryMatch = categoryFilter === 'all' || mentor.skillsToTeach.some((s) => s.category === categoryFilter);
      const skillMatch = skillFilter === 'all' || mentor.skillsToTeach.some((s) => s.name === skillFilter);
      return categoryMatch && skillMatch;
    });
  }, [mentors, categoryFilter, skillFilter]);

  const openRequestModal = (mentor) => {
    setSelectedMentor(mentor);
    setIsModalOpen(true);
    if (mentor.skillsToTeach.length > 0) setRequestSkillId(mentor.skillsToTeach[0]._id);
    setSessionCost(20); // Reset to a default value
  };

  const closeRequestModal = () => {
    setIsModalOpen(false);
    setSelectedMentor(null);
    setRequestMessage('');
    setRequestSkillId('');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (sessionCost <= 0) {
      alert('You must offer at least 1 coin for a session.');
      return;
    }
    if (user.skillMoney < sessionCost) {
      alert(`Insufficient balance. You need ${sessionCost} coins, but you only have ${user.skillMoney}.`);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/requests', {
        teacherId: selectedMentor._id,
        skillId: requestSkillId,
        message: requestMessage,
        cost: sessionCost,
      });
      alert('Your request has been sent successfully!');
      await reloadUser();
      closeRequestModal();
    } catch (err) {
      alert(err.response?.data?.msg || 'There was an error sending your request.');
    }
  };

  const uniqueCategories = [...new Set(allSkills.map(skill => skill.category))];

  if (loading) return <div className="loading-text">Loading Mentors...</div>;

  return (
    <>
      <div className="discover-page-content">
        <div className="card filters-card">{/* Filters JSX remains the same */}</div>
        <div className="user-cards-grid">{/* User cards JSX remains the same */}</div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeRequestModal}>
        {selectedMentor && (
          <form onSubmit={handleRequestSubmit} className="request-form">
            <h2>Request a Session with {selectedMentor.name}</h2>
            <div className="form-group"><label>Skill to learn</label><select className="filter-select" value={requestSkillId} onChange={(e) => setRequestSkillId(e.target.value)}>{selectedMentor.skillsToTeach.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}</select></div>
            
            {/* --- NEW: User Defined Coin Input --- */}
            <div className="form-group">
              <label>How many SkillMoney coins do you offer for this session?</label>
              <input
                type="number"
                className="filter-select"
                value={sessionCost}
                onChange={(e) => setSessionCost(Number(e.target.value))}
                min="1"
              />
            </div>

            <div className="form-group"><label>Your Message</label><textarea placeholder={`Hi ${selectedMentor.name}, I'd love to learn...`} rows="4" value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} required></textarea></div>
            <button type="submit" className="connect-btn">Send Request & Spend {sessionCost} Coins</button>
          </form>
        )}
      </Modal>
    </>
  );
};

export default DiscoverPage;