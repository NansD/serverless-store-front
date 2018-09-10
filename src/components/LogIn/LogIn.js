import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel, Col } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Route,
  withRouter,
  Link
} from 'react-router-dom'
import './LogIn.css'
const axios = require('axios')
class LogIn extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  validateForm () {
    return this.state.email.length > 0 && this.state.password.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({ isLoading: true })
    let details = this.state
    var URLParameters = ''
    for (var key in details) {
      if (URLParameters !== '') {
        URLParameters += '&'
      }
      URLParameters += key + '=' + encodeURIComponent(details[key])
    }
    axios.get('http://localhost:3000/auth?' + URLParameters).then(function (response) {
      let authenticated = (response.status === 200)
      this.props.setAuthentication(authenticated, response.data.user)
      if (authenticated) {
        this.props.history.push('/')
      } else {
        this.setState({ isLoading: false })
      }
    }.bind(this))
  }

  render () {
    return (
      <div>
        <Col xs={1} md={2} />
        <Col xs={10} md={8}>
          <div className='Login'>
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId='email' bsSize='large'>
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  autoFocus
                  type='email'
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup controlId='password' bsSize='large'>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.password}
                  onChange={this.handleChange}
                  type='password'
                />
              </FormGroup>
              <Button
                block
                bsSize='large'
                disabled={!this.validateForm()}
                type='submit'
              >
            Login
              </Button>
            </form>
          </div>
        </Col>
        <Col xs={1} md={2} />
      </div>
    )
  }
}
export default withRouter(LogIn)
