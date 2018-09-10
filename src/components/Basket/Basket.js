import React, { Component } from 'react'
import { Panel, ListGroup } from 'react-bootstrap'
import BasketLine from '../BasketLine/BasketLine'
import('./Basket.css')
export default class Basket extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    var basketLines = []
    var hide = ''
    if (this.props && this.props.basket) {
      basketLines = this.props.basket.basketLines.map((basketLine) => {
        return <BasketLine key={basketLine.product._id} basketLine={basketLine} removeFromBasket={this.props.removeFromBasket} />
      })
    }
    if (basketLines.length === 0 || !Object.keys(this.props.user).length) {
      hide = 'hide'
    }
    return (
      <div className={`basket ${hide}`}>
        <Panel>
          <Panel.Heading>Basket</Panel.Heading>
          <ListGroup>
            {basketLines}
          </ListGroup>
        </Panel>
      </div>
    )
  }
}
