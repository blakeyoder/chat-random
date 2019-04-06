import React, {Component} from "react";
import WelcomeScreen from './Components/WelcomeScreen';
import ChatWindow from './Components/ChatWindow';
import io from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      clients: null,
      currentClient: null,
      currentClientPartner: null,
      socketConnected: false,
    };
    
    this.socket = null;
    this.endpoint = 'http://localhost:4001';
  }

  componentDidMount = () => {
    this.socket = io(this.endpoint);
    this.socket.on('socket connection', this.handleSocketConnection)
    this.socket.on('initial state', this.handleInitialState)
    this.socket.on('client joined', this.handleClientJoined)
    this.socket.on('chat user found', this.setClientPartner)
    this.socket.on('register self', this.setCurrentClient)
  }

  handleInitialState = (initialState) => {
    this.setState({
      clients: initialState,
    })
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
              clients={this.state.clients} />
        }
      </div>
    )
  }
}
export default App;
