import React, { Component } from 'react';
import { Link } from 'react-router';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
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
          <NavItem onClick={this.logout}>Logout</NavItem>
          <li role='presentation'><Link to={'/events'}>Events</Link></li>
          <li role='presentation'><Link to={'/dashboard'}>Dashboard</Link></li>
          <li role='presentation'><Link to={'/settings'}>User Settings</Link></li>
        </Nav>
      );
    } else if(this.state.authenticated) {
      content = (
        <Nav>
          <NavItem onClick={this.logout} eventKey={1}>Logout</NavItem>
          <li role='presentation'><Link to={'/events'}>Events</Link></li>
          <li role='presentation'><Link to={'/settings'}>Settings</Link></li>
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
            <Link to={'/'}>Points</Link>
          </Navbar.Brand>
        </Navbar.Header>
        {content}
      </Navbar>
    );
  }
}

export default HeaderComponent;
