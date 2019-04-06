const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const port = 4001
const app = express()
const server = http.createServer(app)
const io = socketIO(server, {origins: "http://localhost:*"})

server.listen(port, () => console.log(`Listening on port ${port}`))

// maintain a list of connected clients
let clients = [];
io.on('connection', (socket) => {
  // register that connection has been opened
  socket.emit('socket connection', true);
  socket.emit('initial state', {clients});

  socket.on('add client', (username) => {
    const currentClient = {
      socketId: socket.id,
      partnerId: null,
      username,
    };
    clients = clients.concat({...currentClient});
    // send message to all connected clients
    io.sockets.emit('client joined', {
      clients,
    })
    // register to socket as well
    socket.currentClient = currentClient;
    socket.emit('register self', {
      currentClient,
    });
  });

  socket.on('request to chat', () => {
    const partner = findChatPartner(socket);
    if (partner) {
      socket.emit('chat user found', findChatPartner(socket));
      io.to(partner.socketId).emit('chat user found', socket.currentClient);
    }
  })

});

function clientHasPartner(client) {

};

function findChatPartner(socket) {
  // get first available client to chat
  if (socket.currentClient.partnerId) return null;
  return clients.find((client) => {
    if (!client.partnerId && socket.id !== client.socketId) return client;
  });
};
