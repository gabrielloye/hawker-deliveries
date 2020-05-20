import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Route, Switch } from 'react-router-dom';

import { Container } from "semantic-ui-react";

import './main.css';

import HawkerList from '../../components/hawkerlist'

import Footer from '../../components/footer'

import PrivateRoute from '../../navigation/private-route'

import { CartItem, CartContext } from '../../components/cartcontext';
import Menubar from "../../components/menubar";
import Store from "../store/store";
import CartPage from "../cartpage/cartpage";
import Dashboard from "../dashboard/dashboard";
import AboutPage from "../about/about";

type State = {};

type Props = {
    match: {
      path: string;
      url: string;
      params: {
          date: string;
          meal: string;
      }
    }
}

class Main extends Component<Props, State> {
  state = {
    date: this.props.match.params.date,
    meal: this.props.match.params.meal,
    cart : new Array<CartItem>(),
    modifyCart: (item : CartItem, isAdd : boolean, meal: string) => {
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
      localStorage.setItem('cart' + this.props.match.params.date + meal, JSON.stringify(newCart));
      this.setState({
        date: this.props.match.params.date,
        cart: newCart,
        meal: meal
      })
    },
    clearCart: () => {
      let newCart = new Array<CartItem>()
      localStorage.setItem('cart'+ this.state.date + this.state.meal, JSON.stringify(newCart))
      this.setState({ cart: newCart })
    }
  }

  componentDidMount() {
    let cartString = localStorage.getItem('cart' + this.props.match.params.date + this.state.meal) || '';
    if (cartString.length != 0) {
      this.setState({
        date: this.props.match.params.date,
        cart: JSON.parse(cartString)
      });
    }
  }

  render() {
    return (
      <div className="App">
        <CartContext.Provider value ={this.state}>
          <Menubar pathName={`${this.props.match.url}`} {...this.props}></Menubar>
          <div style={{"minHeight": "100vh", "padding": "1.5rem 2rem 80px 2rem"}}>
            <Switch>
              <Route exact path='/main/about' component={AboutPage}/>
              <PrivateRoute exact path='/main/dashboard' component={Dashboard}/>
              <PrivateRoute exact path={`${this.props.match.path}/dashboard`} component={Dashboard} />
              <Route exact path={`${this.props.match.path}/product/:productId`} render={(props) => <Store {...props}/>}/>
              <Route path={`${this.props.match.path}/cart`} render={(props) => <CartPage pathName={this.props.match.url} {...props}/>}/>
              <Container>
                <Route exact path={`${this.props.match.path}`} render={(props) => <HawkerList {...props}/>}/>
              </Container>
            </Switch>
          </div>
          <Footer></Footer>
        </CartContext.Provider>
      </div>
    );
  }
}

export default Main;