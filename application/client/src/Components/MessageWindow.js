import React, {Component} from "react";
import {preventDefault} from '../utils/dom';
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
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message);
    this.setState({
      message: '',
    });
  }

  render() {
    const {currentClient} = this.props.currentClient;
    return (
      <React.Fragment>
        <div className="message-window">
          {this.props.chatMessages.map((message, idx) => {
              return (
                <p
                  className={message.username === currentClient.username ? 'self-message' : ''}
                  key={idx}>
                  {message.username}: {message.message}
                </p>
              )
            })
          }
        </div>
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
