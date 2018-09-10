import React, { Component } from 'react'
import './SignUp.css'
import {
  HelpBlock,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap'
import LoaderButton from '../LoaderButton/LoaderButton'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

export default class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      newUser: null
    }
  }
  componentDidMount () {
    this._ismounted = true
  }

  componentWillUnmount () {
    this._ismounted = false
  }
    validateForm = function () {
      return (
        this.state.email.length > 0 &&
        this.state.password.length > 0 &&
        this.state.password === this.state.confirmPassword
      )
    }

    handleChange = event => {
      if (this._ismounted === true) {
        this.setState({
          [event.target.id]: event.target.value
        })
      }
    }

    handleSubmit = async event => {
      event.preventDefault()

      this.setState({ isLoading: true })

      let details = this.state
      var formBody = []
      for (var property in details) {
        var encodedKey = encodeURIComponent(property)
        var encodedValue = encodeURIComponent(details[property])
        formBody.push(encodedKey + '=' + encodedValue)
      }
      formBody = formBody.join('&')
      fetch('http://localhost:3000/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      }).then(function (response) {
        this.props.history.push('/')
        if (this._ismounted === true) {
          this.setState({ isLoading: false })
        }
      }.bind(this))
    }

    renderForm () {
      return (
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId='name' bsSize='large'>
            <ControlLabel>Name</ControlLabel>
            <FormControl
              type='text'
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId='email' bsSize='large'>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type='email'
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId='password' bsSize='large'>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              type='password'
            />
          </FormGroup>
          <FormGroup controlId='confirmPassword' bsSize='large'>
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              type='password'
            />
          </FormGroup>
          <LoaderButton
            block
            bsSize='large'
            disabled={!this.validateForm()}
            type='submit'
            isLoading={this.state.isLoading}
            text='Sign Up !'
            loadingText='Signing up…'
          />
        </form>
      )
    }

    render () {
      return (
        <div>
          <Col xs={1} md={2} />
          <Col xs={10} md={8}>
            <div className='Signup'>
              {this.renderForm()}
            </div>
          </Col>
          <Col xs={1} md={2} />
        </div>

      )
    }
}
