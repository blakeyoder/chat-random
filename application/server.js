const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const SocketClient = require('./socket/SocketClient')
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
    const currentClient = new SocketClient({
      socketId: socket.id,
      partnerId: null,
      username,
    });
    clients = clients.concat(currentClient);
    // send message to all connected clients
    io.sockets.emit('client joined', {clients})
    // register to socket as well
    socket.currentClient = currentClient;
    socket.emit('register self', {currentClient});
  });

  socket.on('request to chat', () => {
    const partner = findChatPartner(clients, socket);
    if (partner) {
      assignPartner(socket, partner);
    }
  })

  socket.on('request new chat', () => {
    const {partnerId} = socket.currentClient;
    // filter out revoked socket id
    const clientWhiteList = clients.filter((client) => client.socketId !== partnerId);
    // revoke partnership with partner
    io.to(partnerId).emit('chat user found', null);
    // null out current clients partner id
    const partner = clients.find((client) => client.socketId === partnerId);
    partner.resetChatPartner();
    socket.currentClient.resetChatPartner();
    const newPartner = findChatPartner(clientWhiteList, socket);
    if (newPartner) {
      assignPartner(socket, newPartner);
    } else socket.emit('chat user found', null);
  });

  socket.on('send message', (message) => {
    const messageObj = {
      message,
      username: socket.currentClient.username,
    }
    // emit message to both the sender and the receiver
    io.to(socket.currentClient.partnerId).emit('incoming message', {...messageObj});
    socket.emit('incoming message', {...messageObj});
  })
});

function assignPartner(socket, partner) {
  socket.currentClient.setChatPartner(partner.socketId);
  socket.emit('chat user found', partner);
  io.to(partner.socketId).emit('chat user found', socket.currentClient);
}

function findChatPartner(availableClients, socket) {
  // get first available client to chat
  if (socket.currentClient.partnerId) return null;
  return availableClients.find((client) => {
    if (!client.partnerId && socket.id !== client.socketId) {
      // set current socket client id on partners
      client.setChatPartner(socket.currentClient.socketId);
      return client;
    };
  });
};
