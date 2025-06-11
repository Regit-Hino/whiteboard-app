const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});