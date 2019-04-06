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
}

module.exports = SocketClient;