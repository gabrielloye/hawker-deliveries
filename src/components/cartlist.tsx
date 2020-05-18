import React from "react";
import { Card, Image } from 'semantic-ui-react'
import { Button, Header } from "semantic-ui-react";

import { CartContext, CartItem } from "./cartcontext";
import './hawkerlist.css';

type Props = {
    cartItems : Array<CartItem>;
}

class CartList extends React.Component<Props> {
    displayListPosts = () =>
    this.props.cartItems.map((el) => {
      const image = el.image!=="" ? el.image : "https://hawker-images.s3-ap-southeast-1.amazonaws.com/generic_images/placeholder.png"
      return (
        <Card
        childKey={ el.name }
        fluid={ true }>
          <div className="listingImage" style={{"backgroundImage":`url(${image})`}}></div>
          <Card.Content>
            <Card.Header>{ el.name }</Card.Header>
            <Card.Meta>{`$${el.price.toFixed(2)}`}</Card.Meta>
          </Card.Content>
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
        </Card>
  )});

  render() {
    if (this.props.cartItems.length > 0)
    {
      return (
        <React.Fragment>
          <Header size="huge" style={{ paddingBottom: '2vh' }}>Cart</Header>
          <Card.Group itemsPerRow="2" stackable style={{paddingBottom: '15%'}}>
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