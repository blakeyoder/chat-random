import React, {Component} from "react";
import {preventDefault} from '../utils/dom';
import '../index.css';
import Loader from 'react-loader-spinner';

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
    };    
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div>
      {this.props.socketConnected
        ? (
        <div>
          <h1>Welcome to the Random Chat App™</h1>
          <form
            className="app-form"
            onSubmit={preventDefault(() => this.props.handleSubmit(this.state.username))}>
            <input
              placeholder="Username"
              type="text"
              onChange={this.handleInput}
              name="username"
              className="app-input"
              autoFocus
              value={this.state.username} />
            <button
              className="app-button"
              type="submit">
              Join!
            </button>
          </form>
        </div>
        ) : <Loader type="ThreeDots"/>}
      </div>
    )
  }
}
