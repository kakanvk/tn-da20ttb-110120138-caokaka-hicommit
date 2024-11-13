const { Server } = require('socket.io');

let io;

function initializeSocket(server) {

  const allowedDomains = [
    'http://192.168.0.103:5173',
    'http://localhost:5173',
  ];

  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (allowedDomains.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getIO };
