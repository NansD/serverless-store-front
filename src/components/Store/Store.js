import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Col, Modal, Button } from 'react-bootstrap'
import Product from '../Product/Product'
import Basket from '../Basket/Basket'
import './Store.css'
const axios = require('axios')
const qs = require('qs')

class Store extends Component {
  constructor (props) {
    super(props)
    this.state = {
      products: []
    }
    // give 'this' context to the member functions
    this.getProducts = this.getProducts.bind(this)
    this.addToBasket = this.addToBasket.bind(this)
    this.updateBasket = this.updateBasket.bind(this)
    this.removeFromBasket = this.removeFromBasket.bind(this)
    this.checkOut = this.checkOut.bind(this)
    this.removeItemIfNoQuantity = this.removeItemIfNoQuantity.bind(this)
    this.putNewBasket = this.putNewBasket.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.checkOut = this.checkOut.bind(this)
    this.handleModalCheckOutClose = this.handleModalCheckOutClose.bind(this)
  }
  componentDidMount () {
    this._mounted = true
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login')
    }
    this.getProducts()
    this.getBasket()
  }
  componentWillUnmount () {
    this._mounted = false
  }
  getProducts = function () {
    axios.get('http://localhost:3000/productsList').then(function (response) {
      const products = response.data.products
      if (this._mounted) {
        this.setState({
          products: products
        })
      }
    }.bind(this))
  }
  getBasket = function () {
    if (!this.props.user) return null
    const userId = this.props.user._id
    axios.get(`http://localhost:3000/getUser?userId=${userId}`).then(function (response) {
      if (response.data.result) {
        let basket = response.data.result.basket
        this.setState({ basket: basket })
      }
    }.bind(this))
  }
  addToBasket = function (product) {
    const productId = product._id
    const index = this.findIndexOfProduct(productId)
    const operation = 1
    this.updateBasket(index, product, operation)
  }
  removeFromBasket (product) {
    const productId = product._id
    const index = this.findIndexOfProduct(productId)
    const operation = -1
    this.updateBasket(index, product, operation)
  }
  findIndexOfProduct (productId) {
    if (this.state === undefined || this.state.basket === undefined) {
      return
    }
    return this.state.basket.basketLines.findIndex(function (basketLine) {
      return basketLine.product._id === productId
    })
  }
  updateBasket (index, product, operation) {
    if (index === undefined) {
      return
    }
    if (index > -1) {
      if ((this.state.basket.basketLines[index].quantity < product.stock && operation === 1) ||
            (this.state.basket.basketLines[index].quantity <= product.stock && operation === -1)) {
        // apply the operation (+1 or -1) to the basket quantity
        var basket = this.state.basket
        basket.basketLines[index].quantity += operation
        this.setState({
          basket: basket
        })
        this.removeItemIfNoQuantity(this.state.basket.basketLines[index], index)
        this.putNewBasket(this.props.user._id, this.state.basket)
      } else if (operation === 1) {
        window.alert(`There is no more stock available for product ${product.name}`)
      } else if (operation === -1) {
        window.alert('unknown error')
      }
    } else if (operation === 1) {
      var basketLines = this.state.basket.basketLines.concat({
        quantity: 1,
        productId: product.id,
        product: product
      })
      var newState = this.state
      newState.basket.basketLines = basketLines
      this.setState(newState)
      this.putNewBasket(this.props.user._id, newState.basket)
    }
  }
  removeItemIfNoQuantity (basketLine, index) {
    if (basketLine.quantity === 0) {
      this.state.basket.basketLines.splice(index, 1)
    }
  }
  putNewBasket (userId, newBasket) {
    axios.put('http://localhost:3000/updateBasket', qs.stringify({ userId: userId, basket: newBasket }))
      .then(function (response, err) {
        console.log(response, err)
      }).catch((error) => {
        console.log(error)
        this.getBasket()
        this.setState({
          modalShow: true
        })
      })
  }
  handleClose () {
    this.setState({ modalShow: false })
  }
  handleModalCheckOutClose () {
    this.setState({ modalCheckOutShow: false })
  }
  checkOut () {
    axios.post('http://localhost:3000/buy', { basket: this.state.basket })
      .then(function (response) {
        if (response) {
          this.setState({ basket: {
            id: this.state.basket.id,
            basketLines: []
          } }, () => {
            this.putNewBasket(this.props.user._id, this.state.basket)
            this.setState({
              modalCheckOutShow: true
            })
            this.getProducts()
          })
        }
      }.bind(this))
  }
  render () {
    const productElements = this.state.products.map(product =>
      <Product key={product._id} product={product} addToBasket={this.addToBasket} />
    )
    return (
      <div>
        <Col xs={0} md={1} />
        <Col xs={12} md={8}>
          <div className='store'>
            {productElements}
          </div>
          <Modal show={this.state.modalShow} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Can't add the product to the basket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>The product might be reserved in other customers' basket</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalCheckOutShow} onHide={this.handleModalCheckOutClose}>
            <Modal.Header closeButton>
              <Modal.Title>Purchase Successfully achieved !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Your products will be shipped soon</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleModalCheckOutClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col xs={12} md={3}>
          <Basket user={this.props.user} basket={this.state.basket} removeFromBasket={this.removeFromBasket} checkOut={this.checkOut} />
        </Col>
      </div>
    )
  }
}
export default withRouter(Store)
