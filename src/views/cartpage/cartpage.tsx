import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";

import './cart.css';

import Menubar from "../../components/menubar";

import CartList from "../../components/cartlist";

import { CartContext } from '../../components/cartcontext';


class Cart extends Component {
  render() {
      return (
        <div className="App">
          <Menubar></Menubar>
          <Container text textAlign="center">
              <CartContext.Consumer>
                {({cart, modifyCart}) => (
                  <CartList cartItems={cart}></CartList>
                )}
              </CartContext.Consumer>
        </Container> 
      </div>
      );
    }
  }

  Cart.contextType = CartContext
  
  export default Cart;