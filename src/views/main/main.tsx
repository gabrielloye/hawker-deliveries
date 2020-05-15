import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Route } from 'react-router-dom';

import { Container } from "semantic-ui-react";

import './main.css';

import HawkerList from '../../components/hawkerlist'

import API from '../../components/axiosapi';

import { CartItem, CartContext } from '../../components/cartcontext';
import Menubar from "../../components/menubar";
import Store from "../store/store";
import CartPage from "../cartpage/cartpage";
import Checkout from "../checkout/checkout";

type State = {};

type Props = {
    match: {
      path: string;
      url: string;
      params: {
          date: string
      }
    }
}

class Main extends Component<Props, State> {
  state = {
    cart : new Array<CartItem>(),
    modifyCart: (item : CartItem, isAdd : boolean) => {
      let newCart = this.state.cart;
      let isExists = false;
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].name === item.name) {
          if (isAdd) {
            isExists = true;
            newCart[i].quantity += item.quantity;
          } else {
              newCart.splice(i, 1);
          }
        }
      }
      if (isAdd && !isExists) {
        newCart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      this.setState({
        cart: newCart
      })
    }
  };

  componentDidMount() {
    // axios.post('https://5ppl4eeg57.execute-api.ap-southeast-1.amazonaws.com/dev')
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    // })
    // let cartString = localStorage.getItem('cart') || '';
    // if (cartString.length != 0) {
    //   this.setState({
    //     cart: JSON.parse(cartString)
    //   });
    // }
  }

  render() {
    return (
      <div className="App">
        <CartContext.Provider value ={this.state}>
          <Menubar pathName={this.props.match.url}></Menubar>
          <Container>
            <Route exact path={`${this.props.match.path}`} render={(props) => <HawkerList {...props}/>}/>
          </Container>
          <Route exact path={`${this.props.match.url}/product/:productId`} render={(props) => <Store {...props}/>}/>
          <Route path={`${this.props.match.url}/cart`}>
            <CartPage pathName={this.props.match.url}/>
          </Route>
          <Route path={`${this.props.match.path}/checkout`} render={(props) => <Checkout {...props}/>}/>
        </CartContext.Provider>
      </div>
    );
  }
}

export default Main;