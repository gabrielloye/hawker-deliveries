import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";

import './main.css';

import HawkerList from '../../components/hawkerlist'

import API from '../../components/axiosapi';

import { CartItem, CartContext } from '../../components/cartcontext';
import Menubar from "../../components/menubar";
import Store from "../store/store";
import CartPage from "../cartpage/cartpage";
import Checkout from "../checkout/checkout";

const products = [
    {
      name: "Da Xi Hainanese Chicken Rice",
      id: "1",
      image: "https://www.thespruceeats.com/thmb/vwIkJwmNwy55CJDYd11enCK5VB0=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hainanese-chicken-rice-very-detailed-recipe-3030408-hero-0a742f08c72044e999202a44e30a1ea7.jpg",
      min_price: 3.50,
      max_price: 5.00
    },
    {
      name: "Ta Lu Prawn Noodles Stall",
      id: "2",
      image: "https://cdn.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_450,h_300/https://danielfooddiary.com/wp-content/uploads/2019/05/prawnnoodles1.jpg",
      min_price: 5,
      max_price: 6
    },
    {
      name: "Wei Yi Laksa",
      id: "3",
      image: "https://i2.wp.com/eatwhattonight.com/wp-content/uploads/2015/12/Laksa4.jpg?resize=1024%2C680&ssl=1",
      min_price: 4.50,
      max_price: 6
    }
  ]

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
    // API.post(`/`)
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(error => {
    //     console.log(error)
    // })
    let cartString = localStorage.getItem('cart') || '';
    if (cartString.length != 0) {
      this.setState({
        cart: JSON.parse(cartString)
      });
    }
  }

  render() {
    return (
      <div className="App">
        <CartContext.Provider value ={this.state}>
          <Menubar pathName={this.props.match.url}></Menubar>
          <Container>
            <Route path={`${this.props.match.path}`} exact render={(props) => <HawkerList {...props} products={products}/>}/>
          </Container>
          <Route path={`${this.props.match.path}/product/:productId`} render={(props) => <Store {...props}/>}/>
          <Route path={`${this.props.match.path}/cart`}>
            <CartPage pathName={this.props.match.url}/>
          </Route>
          <Route path={`${this.props.match.path}/checkout`} render={(props) => <Checkout {...props}/>}/>
        </CartContext.Provider>
      </div>
    );
  }
}

export default Main;