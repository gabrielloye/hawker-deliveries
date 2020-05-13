import React from "react";
import { Card, Image } from 'semantic-ui-react'
import { Button, Header } from "semantic-ui-react";

import { CartContext, CartItem } from "./cartcontext";

type Props = {
    cartItems : Array<CartItem>;
}

class CartList extends React.Component<Props> {
    displayListPosts = () =>
    this.props.cartItems.map((el) => (
      <Card
      image={ el.image }
      header={ el.name }
      meta= { `$${el.price.toFixed(2)}` }
      extra={ 
        <Card.Content extra>
        <div className="label">
          Quantity: <strong>{ el.quantity }</strong>
        </div>
            <CartContext.Consumer>
                {({cart, modifyCart}) => (
                    <Button onClick={() => {modifyCart(el, false);}}>
                            Remove from Cart
                    </Button>
                )}
          </CartContext.Consumer>
          </Card.Content>
       }
      fluid={ true }
    />
  ));

  render() {
    if (this.props.cartItems.length > 0)
    {
      return (
        <React.Fragment>
          <Header size="huge" style={{ paddingBottom: '2vh' }}>Cart</Header>
          <Card.Group itemsPerRow="2" stackable>
            { this.displayListPosts() }
          </Card.Group>
        </React.Fragment>
      )
    } else {
      return (<h1>No cart items</h1>)
    }
  }
}

export default CartList