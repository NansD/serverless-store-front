import React, { Component } from 'react'
import { Panel, Button, Glyphicon, Tooltip, OverlayTrigger } from 'react-bootstrap'
import './Product.css'
export default class Product extends Component {
  constructor (props) {
    super(props)
    if (!props.product.quantity) {
      this.state = {
        buyable: false
      }
    }
    this.addProductToBasket = this.addProductToBasket.bind(this)
  }
  addProductToBasket = function () {
    this.props.addToBasket(this.props.product)
  }
  render () {
    var buyButton = <Button className='buy' onClick={this.addProductToBasket}>Buy {this.props.product.name}  <Glyphicon glyph='shopping-cart' /></Button>
    if (!this.props.product.stock) {
      const tooltip = <Tooltip id='tooltip'>
      This item is not available
      </Tooltip>
      buyButton = <OverlayTrigger placement='right' overlay={tooltip}>
        <span><Button className='buy' disabled>Buy {this.props.product.name}  <Glyphicon glyph='shopping-cart' /></Button></span>
      </OverlayTrigger>
    }
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title componentClass='h2'>
            {this.props.product.name}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body className='display-flex'>
          <img className='resize' src={this.props.product.imgUrl} />
          <Panel className='product-description'>
            <Panel.Heading> <Panel.Title>Product Information</Panel.Title></Panel.Heading>
            <Panel.Body>{ JSON.stringify(this.props.product) }</Panel.Body>
          </Panel>
          {buyButton}
        </Panel.Body>
      </Panel>
    )
  }
}
