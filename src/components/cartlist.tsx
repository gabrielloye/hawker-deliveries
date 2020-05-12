import React from "react";
import ProductQuantity from "./productquantity";
import { CartContext, CartItem } from "./cartcontext";

type Props = {
    cartItems : Array<CartItem>;
}

class CartList extends React.Component<Props> {
    displayListPosts = () =>
    this.props.cartItems.map((el) => (
        <div className="column">
        <div className="ui fluid card">
        <div className="image">
          <img src={el.image}/>
        </div>
        <div className="content">
          <a className="header">{ el.name }</a>
          <div className="meta">
            <span className="date">{ `$${el.price.toFixed(2)}` }</span>
          </div>
          <div className="description">
            { el.description }
          </div>
        </div>
        <div className="extra content">
            <div className="label">Quantity: <strong>{ el.quantity }</strong></div>
            <CartContext.Consumer>
                {({cart, modifyCart}) => (
                    <button onClick={() => {modifyCart(el, false);}}>
                            Remove from Cart
                    </button>
                )}
          </CartContext.Consumer>
        </div>
      </div>
      </div>
  ));

  render() {
    if (this.props.cartItems.length > 0)
    {
      return (<div className="ui three column grid">{ this.displayListPosts() }</div>)
    } else {
      return (<h1>No cart items</h1>)
    }
  }
}

export default CartList