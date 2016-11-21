import React, { Component } from 'react';
import AuthStore from '../stores/AuthStore';
// import AuthActions from '../actions/AuthActions';
// import AuthStore from '../stores/AuthStore';

class HeaderComponent extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: AuthStore.isAuthenticated(),
      profile: JSON.parse(AuthStore.getUser()),
      name: ''
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({authenticated: AuthStore.isAuthenticated(),
    profile: JSON.parse(AuthStore.getUser())});
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  onSubmit() {

  }

  render() {
    let name = 'Unknown';
    if(this.state.profile && this.state.profile.user_metadata && this.state.profile.user_metadata.name) {
      name = this.state.profile.user_metadata.name;
    } else if(this.state.profile) {
      name = this.state.profile.nickname;
    }
    return (
      <div>
        <h2>User Settings</h2>
        Current Name: {name}
        <div className='form-group'>
          <label htmlFor='displayName'>Display Name</label>
          <input type='text' value={this.state.name} onChange = {this.handleNameChange} className='form-control' id='displayName' aria-describedby='eventHelp' placeholder='Enter display name'/>
          <small id='eventName' className='form-text text-muted'>Enter a new display name.</small>
        </div>
        <button className='btn btn-success' onClick={this.onSubmit}>Change Name</button>
      </div>
    );
  }
}

export default HeaderComponent;
