const socketIO = require('socket.io');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle private messages
    socket.on('privateMessage', async (data) => {
      const { recipientId, content } = data;
      io.to(recipientId).emit('newMessage', {
        senderId: socket.user.id,
        content,
        timestamp: new Date()
      });
    });

    // Handle live stream interactions
    socket.on('joinStream', (streamId) => {
      socket.join(`stream:${streamId}`);
    });

    socket.on('streamComment', (data) => {
      io.to(`stream:${data.streamId}`).emit('newStreamComment', {
        userId: socket.user.id,
        content: data.content,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;