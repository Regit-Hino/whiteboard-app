const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow localhost and vercel domains
      if (!origin || 
          origin.includes('localhost') || 
          origin.includes('vercel.app') ||
          origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost and vercel domains
    if (!origin || 
        origin.includes('localhost') || 
        origin.includes('vercel.app') ||
        origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else {
      console.log('Express CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

let drawingData = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.emit('drawing-data', drawingData);

  socket.on('draw', (data) => {
    drawingData.push(data);
    socket.broadcast.emit('draw', data);
  });

  socket.on('clear', () => {
    drawingData = [];
    socket.broadcast.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS origins:', [
    "http://localhost:3000",
    "https://client-fvvebqyck-hino-takafumis-projects.vercel.app",
    process.env.CLIENT_URL
  ].filter(Boolean));
});