const express = require('express');
const http = require('http'); // <-- Need the http module
const { Server } = require('socket.io'); // <-- Import Socket.io Server
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // <-- Create an HTTP server from the Express app

// --- Configure Socket.io with CORS ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow our React app to connect
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));

const PORT = process.env.PORT || 5000;

// --- Socket.io Signaling Logic ---
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  // User joins a specific session room
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session room: ${sessionId}`);
    // Notify other user in the room
    socket.to(sessionId).emit('user-joined', socket.id);
  });

  // Pass on the WebRTC offer
  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  // Pass on the WebRTC answer
  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });

  // Pass on ICE candidates
  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', payload);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- Start the server ---
server.listen(PORT, () => {
  console.log(`Server is running in development mode on port ${PORT}`);
});