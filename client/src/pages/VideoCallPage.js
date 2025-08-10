import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './VideoCallPage.css';

// Using a public STUN server from Google. This helps peers find each other.
const iceConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

const VideoCallPage = () => {
  const { sessionId } = useParams();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socketRef = useRef();
  const peerConnectionRef = useRef();
  const localStreamRef = useRef();

  const [status, setStatus] = useState('Ready to join the call.');
  const [callActive, setCallActive] = useState(false);

  // --- Main WebRTC Logic (wrapped in useCallback for stability) ---
  const handleCall = useCallback(async () => {
    setStatus('Requesting camera access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      localVideoRef.current.srcObject = stream;
      setCallActive(true);
      setStatus('Connecting to signaling server...');

      // --- Connect to Socket.io Server ---
      socketRef.current = io('http://localhost:5000');
      
      // --- Emit 'join-session' to the server ---
      socketRef.current.emit('join-session', sessionId);
      
      // --- Main Socket Event Listeners ---
      
      // Fired when the OTHER user joins the room
      socketRef.current.on('user-joined', (otherUserId) => {
        setStatus('Peer has joined. Creating offer...');
        
        // 1. Create the Peer Connection
        peerConnectionRef.current = new RTCPeerConnection(iceConfig);

        // 2. Add local stream tracks to the connection
        localStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        // 3. Set up listeners for the peer connection
        setupPeerConnectionListeners(otherUserId);

        // 4. Create an offer and send it
        peerConnectionRef.current.createOffer()
          .then(offer => peerConnectionRef.current.setLocalDescription(offer))
          .then(() => {
            const payload = { target: otherUserId, caller: socketRef.current.id, sdp: peerConnectionRef.current.localDescription };
            socketRef.current.emit('offer', payload);
            setStatus('Offer sent. Waiting for answer...');
          });
      });

      // Fired when an offer is received from a peer
      socketRef.current.on('offer', (payload) => {
        setStatus('Offer received. Creating answer...');
        
        // 1. Create the Peer Connection
        peerConnectionRef.current = new RTCPeerConnection(iceConfig);

        // 2. Add local stream tracks
        localStreamRef.current.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        // 3. Set up listeners
        setupPeerConnectionListeners(payload.caller);

        // 4. Set remote description and create answer
        peerConnectionRef.current.setRemoteDescription(payload.sdp)
          .then(() => peerConnectionRef.current.createAnswer())
          .then(answer => peerConnectionRef.current.setLocalDescription(answer))
          .then(() => {
            const answerPayload = { target: payload.caller, caller: socketRef.current.id, sdp: peerConnectionRef.current.localDescription };
            socketRef.current.emit('answer', answerPayload);
            setStatus('Answer sent. Connection should establish.');
          });
      });

      // Fired when an answer is received
      socketRef.current.on('answer', (payload) => {
        setStatus('Answer received. Establishing connection...');
        peerConnectionRef.current.setRemoteDescription(payload.sdp);
      });

      // Fired when an ICE candidate is received
      socketRef.current.on('ice-candidate', (payload) => {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      });

    } catch (err) {
      console.error(err);
      setStatus('Camera/microphone access denied. Please enable it in your browser settings.');
    }
  }, [sessionId]);

  // --- Helper function to set up peer connection event listeners ---
  const setupPeerConnectionListeners = (targetId) => {
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        const payload = { target: targetId, candidate: event.candidate };
        socketRef.current.emit('ice-candidate', payload);
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
      setStatus('Connected!');
    };
  };

  // --- Cleanup logic ---
  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="video-call-container">
      {!callActive ? (
        <div className="pre-call-screen">
          <h1>Session Room</h1>
          <p>You are about to join the video session for room: <strong>{sessionId}</strong></p>
          <button className="btn-join-session" onClick={handleCall}>
            <i className="fas fa-video"></i> Join with Camera & Mic
          </button>
          <p className="video-status">{status}</p>
        </div>
      ) : (
        <>
          <h1 className="video-title">SkillSwap Session</h1>
          <p className="video-status">{status}</p>
          <div className="video-grid">
            <div className="video-wrapper">
              <video ref={localVideoRef} autoPlay muted playsInline></video>
              <div className="video-label">You</div>
            </div>
            <div className="video-wrapper">
              <video ref={remoteVideoRef} autoPlay playsInline></video>
              <div className="video-label">Peer</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCallPage;