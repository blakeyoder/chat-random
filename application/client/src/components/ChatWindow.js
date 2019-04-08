import React, {Component} from "react";
import MessageWindow from './MessageWindow';
import Loader from 'react-loader-spinner';

export default class ChatWindow extends Component {
  render() {
    const {clients, currentClient} = this.props;
    return (
      <div>
        <p>{clients.length} Users in Forum</p>
        <h1>Welcome, {currentClient.currentClient.username}</h1>
        {this.props.chatPartner
            ? 
            <div>
              <h3>Chatting with, {this.props.chatPartner.username}</h3>
              <MessageWindow {...this.props} />
            </div>
          : <h2>Waiting for partner, you will be automatically assigned <Loader type="ThreeDots"/></h2>}
      </div>
    )
  }
}
