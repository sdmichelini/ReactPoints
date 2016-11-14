import React, { Component } from 'react';
import { Nav, Navbar, NavItem, Header, Brand } from 'react-bootstrap';
import AuthActions from '../actions/AuthActions';
import AuthStore from '../stores/AuthStore';
// import AuthActions from '../actions/AuthActions';
// import AuthStore from '../stores/AuthStore';

class HeaderComponent extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: AuthStore.isAuthenticated()
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login() {
    this.props.lock.show((err, profile, token) => {
      if (err) {
        alert(err);
        return;
      }
      AuthActions.logUserIn(profile, token);
      this.setState({authenticated: true});
    });
  }

  logout() {
    AuthActions.logUserOut();
    this.setState({authenticated: false});
  }

  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">React Points</a>
          </Navbar.Brand>
        </Navbar.Header>

        { !this.state.authenticated ? (
          <Nav>
          <NavItem onClick={this.login}>Login</NavItem>
          </Nav>
        ) : (
          <Nav>
            <NavItem onClick={this.logout} eventKey={1}>Logout</NavItem>
            <NavItem href={'/events'} eventKey={2}>Events</NavItem>
          </Nav>
        )}
      </Navbar>
    );
  }
}

export default HeaderComponent;
