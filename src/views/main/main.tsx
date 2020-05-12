import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";

import './main.css';

import HawkerList from '../../components/hawkerlist'

import moment from 'moment';
import { CartItem, CartContext } from '../../components/cartcontext';
import Menubar from "../../components/menubar";
import Store from "../store/store";
import CartPage from "../cartpage/cartpage";

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
        params: {
            date: string
        }
    }
}

class Main extends Component<Props, State> {
  state = {
    cart : new Array<CartItem>(),
    modifyCart: (item : CartItem, isAdd: boolean) => {}
  };

  modifyCart = (item : CartItem, isAdd : boolean) => {
    let newCart = this.state.cart;
    if (isAdd) {
      newCart.push(item);
    } else {
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].name === item.name) {
          newCart.splice(i, 1);
        }
      }
    }
    this.setState({
      cart: newCart,
      modifyCart: this.modifyCart
    })
  }

  render() {
    this.setState({
      modifyCart: this.modifyCart
    });
    return (
      <div className="App">
        <Menubar></Menubar>
        <Router>
        <CartContext.Provider value ={this.state}>
          <Switch>
            <Route path="/" exact>
              <Container text textAlign="center">
                <Header size="huge">Tanglin Halt Market</Header>
                <p className="lead">
                  These are the stalls available for {moment(this.props.match.params.date, "DDMMYYYY").format("Do MMMM YYYY")} Lunch
                </p>
                <HawkerList products={products}></HawkerList>
              </Container>
            </Route>
            <Route path="/product/:productId" render={(props) => <Store {...props}/>}/>
            <Route path="/cart">
              <CartPage/>
            </Route>
          </Switch>
          </CartContext.Provider>
        </Router>
        
      </div>
    );
  }
}

export default Main;