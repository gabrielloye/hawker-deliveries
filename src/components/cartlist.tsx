import React from "react";
import { Card, Image, Divider } from 'semantic-ui-react'
import { Button, Header } from "semantic-ui-react";

import moment from 'moment';
import { CartContext, CartItem } from "./cartcontext";
import './hawkerlist.css';
import CartQuantity from "./cartquantity";

type Props = {
  meal: string;
  zone: string;
}

class CartList extends React.Component<Props> {
  getExistingQuantity = (cart: CartItem[], itemName: string) => {
    for (let el of cart) {
      if (el.name === itemName) {
        return el.quantity
      }
    }
    return  0
  }

  displayListPosts = (cart: CartItem[]) =>
    cart.map((el) => {
      const image = el.image !== "" ? el.image : "https://hawker-images.s3-ap-southeast-1.amazonaws.com/generic_images/placeholder.png"
      return (
        <Card
          childKey={el.name}
          fluid={true}>
          <div className="listingImage" style={{ "backgroundImage": `url(${image})` }}></div>
          <Card.Content>
            <Card.Header>{el.name}</Card.Header>
            <Card.Description>{`$${(el.price * el.quantity).toFixed(2)}`}  (+{`$${(el.margin * el.quantity).toFixed(2)}`})</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <CartContext.Consumer>
              {({ cart, modifyCart, meal, zone }) => (
                <React.Fragment>
                <CartQuantity  item={el} quantity={el.quantity} existingQuantity={this.getExistingQuantity(cart, el.name)} 
                maxQuantity={el.maxQuantity} stallId={el.stallId}/>
                <Divider hidden/>
                <Button onClick={() => { modifyCart(el, false, meal, zone); }}>
                  Remove from Cart
                </Button>
                </React.Fragment>
              )}
            </CartContext.Consumer>
          </Card.Content>
        </Card>
      )
    });

  renderCartList = (cart: CartItem[], date: string) => {
    if (cart.length > 0) {
      return (
        <React.Fragment>
          <Header size="huge" >Cart
          </Header>
          <Divider hidden/>
          <Divider horizontal>
            <Header as='h3'>{moment(date, "DDMMYYYY").format("DD-MM-YYYY")}</Header>
          </Divider>
          <Header style={{color: '#8c8c8c'}} as='h3'>{this.props.zone} ({this.props.meal})</Header>
          <Divider hidden/>
          <Card.Group itemsPerRow="2" stackable style={{ paddingBottom: '15%' }}>
            {this.displayListPosts(cart)}
          </Card.Group>
        </React.Fragment>
      )
    } else {
      return (<h1>No cart items</h1>)
    }
  }

  render() {
    return (
      <CartContext.Consumer>
        {({ cart, date }) => (
          <React.Fragment>
            {this.renderCartList(cart, date)}
          </React.Fragment>
        )}
      </CartContext.Consumer>
    )
  }
}


CartList.contextType = CartContext

export default CartList