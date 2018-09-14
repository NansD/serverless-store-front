import React, { Component } from 'react'
import { ListGroupItem, Button } from 'react-bootstrap'

export default class BasketLine extends Component {
  constructor (props) {
    super(props)
    this.removeLine = this.removeLine.bind(this)
  }
  removeLine () {
    this.props.removeFromBasket(this.props.basketLine.product)
  }
  render () {
    return (
      <ListGroupItem className='basketline'>
        <Button onClick={this.removeLine}> remove item</Button>{ this.props.basketLine.product.name }: {this.props.basketLine.quantity}
      </ListGroupItem>
    )
  }
}
