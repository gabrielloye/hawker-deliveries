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
            <span className="date">{ el.price }</span>
          </div>
          <div className="description">
            { el.description }
          </div>
        </div>
        <div className="extra content">
            <div className="label">Quantity</div>
            <strong>{ el.quantity }</strong>
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
    return (<div className="ui three column grid">{ this.displayListPosts() }</div>)
  }
}

export default CartList