import React, { Component } from 'react'
import './App.css'
import SignUp from '../SignUp/SignUp'
import Store from '../Store/Store'
import Basket from '../Basket/Basket'
import LogIn from '../LogIn/LogIn'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Grid, Row, Col, Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAuthenticated: false
    }
    this.setAuthentication = this.setAuthentication.bind(this)
  }
  setAuthentication = function (bool, user) {
    this.setState({
      isAuthenticated: bool,
      user: user
    })
  }
  logOut = function () {
    this.setState({
      isAuthenticated: false,
      user: {}
    })
  }

  render () {
    var logInNav = ''
    var signUpNav = ''
    var logOutNav = ''
    if (!this.state.isAuthenticated) {
      logInNav = <Navbar.Text>
        <Link to='/logIn'>Log In</Link>
      </Navbar.Text>
      signUpNav = <Navbar.Text>
        <Link to='/signUp'>Sign Up</Link>
      </Navbar.Text>
    } else {
      logOutNav = <Navbar.Text>
        <a onClick={this.logOut.bind(this)}>Log Out</a>
      </Navbar.Text>
    }
    return (
      <Router>
        <Row className='show-grid'>
          <div className='App'>
            <div className='App-header'>
              <Navbar inverse className='bg-primary'>
                <Navbar.Header>
                  <Navbar.Brand>
                    <Link to='/'>Serverless Store</Link>
                  </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Text>
                  <Link to='/'>Home</Link>
                </Navbar.Text>
                {logInNav}
                {signUpNav}
                {logOutNav}
              </Navbar>
            </div>
          </div>
          <Route exact path='/' render={(props) => (<Store isAuthenticated={this.state.isAuthenticated} user={this.state.user} />)} />
          <Route path='/signUp' component={SignUp} />
          <Route path='/logIn' render={(props) => (<LogIn setAuthentication={this.setAuthentication} />)} />

        </Row>
      </Router>
    )
  }
}

export default App
