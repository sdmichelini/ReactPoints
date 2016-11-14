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
      authenticated: AuthStore.isAuthenticated(),
      admin: AuthStore.isAdmin()
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  login() {
    this.props.lock.show((err, profile, token) => {
      if (err) {
        alert(err);
        return;
      }
      AuthActions.logUserIn(profile, token);

    });
  }

  logout() {
    AuthActions.logUserOut();
    this.setState({authenticated: false});
  }

  componentWillMount() {
    AuthStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this.onChange);
  }

  onChange() {
    this.setState({authenticated: AuthStore.isAuthenticated(),
    admin: AuthStore.isAdmin()});
  }

  render() {
    let content;
    if(this.state.authenticated && this.state.admin) {
      content = (
        <Nav>
          <NavItem onClick={this.logout} eventKey={1}>Logout</NavItem>
          <NavItem href={'/events'} eventKey={2}>Events</NavItem>
          <NavItem href={'/dashboard'} eventKey={2}>Dashboard</NavItem>
        </Nav>
      );
    } else if(this.state.authenticated) {
      content = (
        <Nav>
          <NavItem onClick={this.logout} eventKey={1}>Logout</NavItem>
          <NavItem href={'/events'} eventKey={2}>Events</NavItem>
        </Nav>
      );
    } else {
      content = (
        <Nav>
          <NavItem onClick={this.login}>Login</NavItem>
        </Nav>
    );
    }
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">React Points</a>
          </Navbar.Brand>
        </Navbar.Header>
        {content}
      </Navbar>
    );
  }
}

export default HeaderComponent;
