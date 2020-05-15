import React, { Component, createRef } from "react";

import "semantic-ui-css/semantic.min.css";

import { Link } from 'react-router-dom';

import { Button, Container, Menu, Sticky } from "semantic-ui-react";

import './cartpage.css';

import CartList from "../../components/cartlist";

import { CartContext, CartItem } from '../../components/cartcontext';

type Props = {
  pathName: string;
}

class Cart extends Component<Props> {
  contextRef = createRef()

  totalCost = (cart: CartItem[]) => {
    let cost = 0;
    let el;
    for (el of cart) {
      cost += el.price * el.quantity;
    }
    return cost;
  }

  render() {
    return (
      <Container text style={{ height: `100vh` }} textAlign="center">
        <Container style={{ paddingBottom: '10vh' }}>
          <CartContext.Consumer>
            {({ cart, modifyCart }) => (
              <CartList cartItems={cart}></CartList>
            )}
          </CartContext.Consumer>
        </Container>
        <Sticky style={{ position: 'fixed', bottom: 0, width: '100vh' }} context={this.contextRef}>

          <CartContext.Consumer>
            {({ cart, modifyCart }) => (
              <Menu borderless fluid inverted size="huge">
                <Menu.Item>
                  <p><strong style={{ color: 'white' }}>Total: </strong>
                    {this.totalCost(cart).toFixed(2)} </p>
                </Menu.Item>

                <Menu.Item position='right'>
                  <Button
                    toggle
                    disabled={this.totalCost(cart) === 0}
                  >
                    <Link to={`${this.props.pathName}/checkout`} style={{ color: 'black' }}>
                      Checkout
                      </Link>
                  </Button>
                </Menu.Item>
              </Menu>
            )}
          </CartContext.Consumer>
        </Sticky>
      </Container>
    );
  }
}

Cart.contextType = CartContext

export default Cart;