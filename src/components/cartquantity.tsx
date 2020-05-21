import React, { Component } from "react";

import CSS from 'csstype';

import "semantic-ui-css/semantic.min.css";

import { Button, ButtonProps, Popup } from 'semantic-ui-react';

import { CartContext, CartItem } from './cartcontext';


type State = {}

type Props = {
  item: CartItem;
  quantity: number;
  existingQuantity: number;
  maxQuantity: number;
  stallId: string;
}

const pStyle: CSS.Properties = {
  marginLeft: '0.6em'
}

class CartQuantity extends Component<Props, State> {
  state = {
    quantity: this.props.quantity,
    isMinQuantity: this.props.quantity === 0,
    isMaxQuantity: this.props.quantity === this.props.maxQuantity,
    open: false,
    prevQuantity: 0
  };

  /**
   * Increment and set State Quantity by 1
   */
  addQuantity = () => {
    let currQuantity = this.state.quantity + 1;
    let isMax = false;
    if (this.props.maxQuantity !== -1) {
      isMax = currQuantity === this.props.maxQuantity
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
    let isMin = currQuantity === 1;
    this.setState({
      quantity: currQuantity,
      isMinQuantity: isMin,
      isMaxQuantity: false
    })
  };

  updateCart = (modifyCart: (cart: CartItem, isAdd: boolean, meal: string, zone: string) => void, isAdd: boolean, meal: string, zone: string) => {
    let newItem: CartItem = {
      id: this.props.item.id,
      stallId: this.props.stallId,
      name: this.props.item.name,
      image: this.props.item.image,
      description: this.props.item.description,
      maxQuantity: this.props.maxQuantity,
      quantity: 1,
      price: this.props.item.price,
      margin: this.props.item.margin
    }
    modifyCart(newItem, isAdd, meal, zone);
  }



  render() {
    return (
      <CartContext.Consumer>
        {({ cart, modifyCart, meal, zone }) => (
          <div className="product-quantity">
            <div className="label">Quantity</div>
            <div className="controls">
              <Button
                icon
                basic
                toggle
                disabled={this.state.isMinQuantity}
                onClick={() => {
                  this.decQuantity()
                  this.updateCart(modifyCart, false, meal, zone)
                }}>
                &#8722;
              </Button>
              <strong> {this.state.quantity}  </strong>
              <Popup
                content={"Sorry, the maximum quantity of the item for the day has been reached."}
                disabled={!this.state.isMaxQuantity}
                inverted
                on={["hover", "click"]}
                key={`${this.props.item.id}`}
                trigger={
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
                          this.updateCart(modifyCart, true, meal, zone)
                        }
                      }
                    }>
                    &#43;
                  </Button>
                }
              />
            </div>
          </div>
        )}
      </CartContext.Consumer>
    )
  }
}

export default CartQuantity