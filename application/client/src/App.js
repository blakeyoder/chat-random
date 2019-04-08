import React, {Component} from "react";
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import io from "socket.io-client";

const WS_HOST = 'http://localhost:4001';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: null,
      currentClient: null,
      currentClientPartner: null,
      socketConnected: false,
      partnerTyping: false,
      chatMessages: [],
    };
    
    this.socket = null;
  }

  componentDidMount = () => {
    this.socket = io(WS_HOST);
    this.socket.on('socket connection', this.handleSocketConnection);
    this.socket.on('initial state', this.handleInitialState);
    this.socket.on('register self', this.setCurrentClient);
    this.socket.on('client joined', this.handleClientJoined);
    this.socket.on('chat user found', this.setClientPartner);
    this.socket.on('incoming message', this.receiveMessage);
    this.socket.on('partner typing', this.handlePartnerTyping);
  }

  handleInitialState = (initialState) => {
    this.setState({
      clients: initialState,
    })
  }

  receiveMessage = (message, command) => {
    this.setState({
      chatMessages: this.state.chatMessages.concat(message),
      partnerTyping: false,
    });
  }

  sendMessage = (message) => {
    const hasCommand = message.startsWith('/');
    if (!hasCommand) this.socket.emit('send message', message);
    if (hasCommand) {
      // searches string and returns first word
      const command = message.replace(/ .*/,'');
      const parsedMessage = message.split(' ');
      if (command === '/delay') {
        // get delay arg
        const delay = parsedMessage[1];
        // return message minus command args
        parsedMessage.splice(0, 2);
        setTimeout(() => {
          this.socket.emit('send message', parsedMessage.join(' '));
        }, delay)
      } else if (command === '/hop') {
        this.setState({
          chatMessages: [],
        }, () => this.socket.emit('request new chat'))
      } else if (command === '/me') {
        // return message minus command args
        parsedMessage.splice(0, 1);
        this.socket.emit('send message', parsedMessage.join(' '), 'me');
      }
    }
  }

  handleSocketConnection = () => {
    this.setState({socketConnected: true});
  }

  setClientPartner = (client) => {
    this.setState({
      currentClientPartner: client,
      chatMessages: [],
    });
  }

  setCurrentClient = (currentClient) => {
    this.setState({currentClient});
    this.socket.emit('request to chat')
  }

  handleClientJoined = (allClients) => {
    const {clients} = allClients;
    this.setState({clients});
  }

  handleNewUser = (username) => {
    this.socket.emit('add client', username);
  }

  handleClientTyping = (val) => {
    if (val) return this.socket.emit('client chatting', true);
    return this.socket.emit('client chatting', false);
  }

  handlePartnerTyping = (val) => this.setState({partnerTyping: val});

  render() {
    return (
      <div>
        {!this.state.currentClient
          ? <WelcomeScreen
            socketConnected={this.state.socketConnected}
            handleInput={this.handleInput}
            handleSubmit={this.handleNewUser} />
          : <ChatWindow
              chatPartner={this.state.currentClientPartner}
              currentClient={this.state.currentClient}
              sendMessage={this.sendMessage}
              chatMessages={this.state.chatMessages}
              handleClientTyping={this.handleClientTyping}
              partnerTyping={this.state.partnerTyping}
              clients={this.state.clients} />
        }
      </div>
    )
  }
}
export default App;
