import React, {Component} from "react";
import {preventDefault} from '../utils/dom';
import Loader from 'react-loader-spinner';
import './MessageWindow.css';
import '../index.css';

export default class MessageWindow extends Component {
  constructor(props) {
    super(props) 
    this.state = {
      message: ''
    }
  }

  handleInput = (e) => {
    const value = e.target.value;
    this.setState({
      [e.target.name]: value,
    }, () => this.handleClientTyping(value));
  }

  handleClientTyping = (val) => {
    if (!!val) return this.props.handleClientTyping(true);
    return this.props.handleClientTyping(false);
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message);
    this.setState({
      message: '',
    });
  }

  determineClassName = (message, client) => {
    let className = '';
    if (message.username === client.username) {
      className = `${className} self-message`;
    }
    if (message.command === 'me') {
      className = `${className} italicize`;
    }
    return className;
  }

  render() {
    const {currentClient} = this.props.currentClient;
    return (
      <React.Fragment>
        <div className="message-window">
          {this.props.chatMessages.map((message, idx) => {
              return (
                <p
                  className={this.determineClassName(message, currentClient)}
                  key={idx}>
                  {message.username}: {message.message}
                </p>
              )
            })
          }
        </div>
        {this.props.partnerTyping && 
          <div className="message-typing">
            <span className="typing-static-message">Partner is typing</span>
            <Loader type="ThreeDots" width={20} height={10} />
          </div>
        }
        <form
          className="app-form"
          onSubmit={preventDefault(this.sendMessage)}>
          <input
            type="text"
            name="message"
            className="app-input"
            autoFocus
            onChange={this.handleInput}
            value={this.state.message} />
          <button 
            type="submit"
            className="app-button">
            Send message
          </button>
        </form>
      </React.Fragment>
    );
  }
}
