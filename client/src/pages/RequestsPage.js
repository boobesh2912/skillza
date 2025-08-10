import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import axios from 'axios';
import './RequestsPage.css';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests/received');
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch requests', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateRequest = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}`, { status });
      fetchRequests();
    } catch (err) {
      alert(`Could not ${status} the request. Please try again.`);
    }
  };

  if (loading) {
    return <div className="loading-text">Loading Your Requests...</div>;
  }

  return (
    <div className="requests-page-content">
      <h1 className="requests-title"><i className="fas fa-inbox"></i> Teaching Requests</h1>
      <div className="requests-grid">
        {requests.length === 0 ? (
          <div className="no-results-card"><p>You have no teaching requests.</p></div>
        ) : (
          requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <div className="user-info-card"><h4>{request.requester.name}</h4><div className="user-meta">Offering: {request.cost} Coins</div></div>
                <div className={`status-badge status-${request.status}`}>{request.status}</div>
              </div>
              <div className="skill-tag-request">Wants to learn: <strong>{request.skill.name}</strong></div>
              <p className="request-message">"{request.message}"</p>

              {request.status === 'pending' && (
                <div className="request-actions">
                  <button className="btn-accept" onClick={() => handleUpdateRequest(request._id, 'accepted')}><i className="fas fa-check"></i> Accept</button>
                  <button className="btn-decline" onClick={() => handleUpdateRequest(request._id, 'declined')}><i className="fas fa-times"></i> Decline</button>
                </div>
              )}
              {request.status === 'accepted' && (
                <div className="accepted-info">
                  <h4>Session Details:</h4>
                  {/* --- THIS IS THE REAL LINK --- */}
                  <Link to={`/session/${request._id}`} className="btn-join-session">
                    <i className="fas fa-video"></i> Join Video Call
                  </Link>
                  <p>Share this link with your student. Both of you must join to start the call.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestsPage;