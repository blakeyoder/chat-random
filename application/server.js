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
    // keep track of current client on the socket itself 
    socket.currentClient = currentClient;
    clients = clients.concat(currentClient);

    socket.currentClient.emitNewClient.call(socket, io, clients);
  });

  socket.on('request to chat', () => {
    const partner = SocketClient.findChatPartner(clients, socket);
    if (partner) {
      SocketClient.assignPartner(io, socket, partner);
    }
  })

  socket.on('client chatting', (isTyping) => {
    socket.currentClient.emitTyping.call(socket, io, isTyping);
  })

  socket.on('request new chat', () => {
    const {partnerId} = socket.currentClient;
    // filter out revoked socket id
    const clientWhiteList = clients.filter((client) => client.socketId !== partnerId);
    // notify client of revoked partnership
    io.to(partnerId).emit('chat user found', null);
    // null out current clients partner id
    const partner = clients.find((client) => client.socketId === partnerId);
    partner.resetChatPartner();
    socket.currentClient.resetChatPartner();
    const newPartner = SocketClient.findChatPartner(clientWhiteList, socket);
    if (newPartner) {
      SocketClient.assignPartner(io, socket, newPartner);
    } else socket.emit('chat user found', null);
  });

  socket.on('send message', (message, command=null) => {
    socket.currentClient.emitMessage.call(socket, io, clients, {
      message,
      username: socket.currentClient.username,
      command,
    });
  })
});
