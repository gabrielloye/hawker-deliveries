import React, { Component, createRef } from "react";

import "semantic-ui-css/semantic.min.css";

import { Link } from 'react-router-dom';

import { Responsive, Button, Container, Menu, Sticky } from "semantic-ui-react";

import './cartpage.css';

import CartList from "../../components/cartlist";

import { CartContext, CartItem } from '../../components/cartcontext';

import { authURL } from '../../components/sandboxoauth';

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
          <CartContext.Consumer>
            {({ cart, modifyCart }) => (
              <CartList cartItems={cart}></CartList>
            )}
          </CartContext.Consumer>
        <Sticky style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '100vh' }} context={this.contextRef}>

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
                    disabled={this.totalCost(cart) == 0}
                    style={{ color: 'black' }}
                    href={authURL}
                  >
                    {/* <Link to={`https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=ec6761aee5b943f4909c1186304ea894&redirect_uri=https%3A%2F%2Flocalhost:3000%2Fmain%2F15052020%2cart&scope=Read&response_type=code&state=0399`} style={{ color: 'black' }}> */}
                      Checkout
                    {/* </Link> */}
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