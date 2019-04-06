import React, {Component} from "react";

export default class ChatWindow extends Component {
  render() {
    const {clients} = this.props;
    return (
      <div>
        <h1>{clients.length} Users in Chat</h1>
        {this.props.chatPartner
            ? <h2>Partner is {this.props.chatPartner.username}</h2>
            : <h2>Waiting for partner...you will be automatically assigned</h2>}
      </div>
    )
  }
}
