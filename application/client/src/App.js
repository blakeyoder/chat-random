import React, {Component} from "react";
import WelcomeScreen from './Components/WelcomeScreen';
import ChatWindow from './Components/ChatWindow';
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
      chatMessages: [],
    };
    
    this.socket = null;
  }

  componentDidMount = () => {
    this.socket = io(WS_HOST);
    this.socket.on('socket connection', this.handleSocketConnection)
    this.socket.on('initial state', this.handleInitialState)
    this.socket.on('register self', this.setCurrentClient)
    this.socket.on('client joined', this.handleClientJoined)
    this.socket.on('chat user found', this.setClientPartner)
    this.socket.on('incoming message', this.receiveMessage)
  }

  handleInitialState = (initialState) => {
    this.setState({
      clients: initialState,
    })
  }

  receiveMessage = (message) => {
    this.setState({
      chatMessages: this.state.chatMessages.concat(message)
    });
  }

  checkForCommand = (message) => {
    // if a string starts with slash we assume its a command
    if (message.startsWith('/')) {
    }
  }

  sendMessage = (message) => {
    const hasCommand = message.startsWith('/');
    if (!hasCommand) this.socket.emit('send message', message);
    if (hasCommand) {
      // searches string and returns first word
      const command = message.replace(/ .*/,'');
      if (command === '/delay') {
        const parsedMessage = message.split(' ');
        // get delay arg
        const delay = parsedMessage[1];
        // return message minus command args
        parsedMessage.splice(0, 2);
        setTimeout(() => {
          this.socket.emit('send message', parsedMessage.join(' '));
        }, delay)
      } else if (command === '/hop') {
        this.setState({
          messages: [],
        }, () => this.socket.emit('request new chat'))
      };
    }
  }

  handleSocketConnection = () => {
    this.setState({socketConnected: true});
  }

  setClientPartner = (client) => {
    this.setState({
      currentClientPartner: client,
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
              clients={this.state.clients} />
        }
      </div>
    )
  }
}
export default App;
