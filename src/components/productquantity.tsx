import React, { Component } from "react";

import CSS from 'csstype';

import "semantic-ui-css/semantic.min.css";

import { Button, Container, Grid, Header, Icon, Menu, Segment, ButtonProps, TransitionablePortal, Popup } from 'semantic-ui-react';

import { CartContext, CartItem } from './cartcontext';


import { FoodItem } from './foodlist';

type State = {}

type Props = {
    item: FoodItem;
    quantity: number;
    maxQuantity: number;
}

const pStyle: CSS.Properties = {
  marginLeft: '0.6em'
}

class ProductQuantity extends Component<Props, State> {
  state = {
    quantity: this.props.quantity,
    isMinQuantity: true,
    isMaxQuantity: false,
    open: false,
    prevQuantity: 0
  };

  handleOpen = () => this.setState({ open: true })

  handleClose = () => this.setState({ open: false })

  resetQuantity = () => {
    const prevQuantity = this.state.quantity
    this.setState({
      prevQuantity: prevQuantity,
      quantity: 0,
      isMinQuantity: true,
      isMaxQuantity: false
    })
  }

  /**
   * Increment and set State Quantity by 1
   */
  addQuantity = () => {
    let currQuantity = this.state.quantity + 1;
    let isMax = false;
    if (this.props.maxQuantity !== -1) {
      isMax = currQuantity === this.props.maxQuantity;
    } else {
      isMax = currQuantity === 100;
    }
    this.setState({
      quantity: currQuantity,
      isMinQuantity: false,
      isMaxQuantity: isMax
    })
  };
  
  /**
   * Decrement and set State Quantity by 1
   */
  decQuantity = () => {
    let currQuantity = this.state.quantity - 1;
    let isMin = currQuantity === 0;
    this.setState({
      quantity: currQuantity,
      isMinQuantity: isMin,
      isMaxQuantity: false
    })
  };


  render() {
    return (
      <div className="product-quantity">
        <div className="label">Quantity</div>
        <div className="controls">
          <Button
            icon
            basic
            toggle
            disabled={this.state.isMinQuantity}
            onClick={ this.decQuantity }>
            &#8722;
          </Button>
          <strong> {this.state.quantity}  </strong>
          <Popup
           content={"Sorry, the maximum quantity of the item for the day has been reached."}
           disabled={!this.state.isMaxQuantity}
           inverted
           on={["hover", "click"]}
           key={`${this.props.item.id}`}
           trigger = {
          <Button
            icon
            basic
            toggle
            style={pStyle}
            onClick={ 
              (event: React.FormEvent<HTMLButtonElement>, data: ButtonProps) => {
                if (this.state.isMaxQuantity) {
                  event.preventDefault()
                } else {
                  this.addQuantity()
                }
              }
             }>
            &#43;
          </Button>
           }
           />
        </div>
        <br/>
        <CartContext.Consumer>
        {({cart, modifyCart}) => (
          <TransitionablePortal
            closeOnTriggerClick
            onOpen={this.handleOpen}
            onClose={this.handleClose}
            openOnTriggerClick
            trigger={
              <Button
                disabled={this.state.quantity===0}
                onClick={() => {
                  let newItem : CartItem = {
                    name: this.props.item.name,
                    image: this.props.item.image,
                    description: this.props.item.description,
                    quantity: this.state.quantity,
                    price: this.props.item.price
                  }
                  this.resetQuantity();
                  modifyCart(newItem, true);
                }}>
                Add To Cart
              </Button>}>
            <Segment style={{ left: '40%', position: 'fixed', bottom: '5%', zIndex: 1000 }}>
              <Header>Item has successfully been added to cart</Header>
              <p>{this.state.prevQuantity} {this.props.item.name} has been added to cart</p>
            </Segment>
          </TransitionablePortal>
        )}
        </CartContext.Consumer>
      </div>
    )
  }
}

export default ProductQuantity