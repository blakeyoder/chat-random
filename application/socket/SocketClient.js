class SocketClient {
  constructor(initObj) {
    for (let [k, v] of Object.entries(initObj)) {
      this[k] = v;
    };
  }

  get hasChatPartner() {
    return Boolean(this.partnerId);
  }

  setChatPartner(id) {
    this.partnerId = id;
  }

  resetChatPartner() {
    this.partnerId = null;
  }

  emitNewClient(io, clients) {
    // send message to all connected clients that a new user has joined
    io.sockets.emit('client joined', {clients})
    // emit to the frontend that user was successfully registered
    this.emit('register self', {currentClient: this.currentClient});
  }

  emitMessage(io, clients, message) {
    // emit message to both the sender and the receiver
    io.to(this.currentClient.partnerId).emit('incoming message', {...message});
    this.emit('incoming message', {...message});
  }

  static assignPartner(io, socket, partner) {
    socket.currentClient.setChatPartner(partner.socketId);
    socket.emit('chat user found', partner);
    io.to(partner.socketId).emit('chat user found', socket.currentClient);
  }

  static findChatPartner(availableClients, socket) {
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
}

module.exports = SocketClient;
