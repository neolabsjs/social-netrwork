// const io = require('socket.io-client'); // import for old es versions
import io from 'socket.io-client';

// dynamic address of backend
const socket = io('http://localhost:5000', {
  query: { userId: '64ef5f437f9b61f4a62171af' }, // dynamic id or user
});

socket.on('connect', () => {
  console.log(`Connected with ID ${socket.id}`);
});

socket.on('error', (err) => {
  console.log(err);
});

socket.on('notification', (message) => {
  console.log(`Received notification: ${message}`);
});
