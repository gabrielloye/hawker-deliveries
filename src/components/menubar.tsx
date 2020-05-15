import React, {Component} from 'react';

import "semantic-ui-css/semantic.min.css";

import { Link } from 'react-router-dom';

import { Button, Container, Grid, Icon, Menu } from 'semantic-ui-react';

import { CartContext } from './cartcontext';

import { CartItem } from './cartcontext';

import moment from 'moment';

/** Helpers */
import { validateToken } from '../auth/Utils/Helpers';

/** Constants */
import { AUTH_USER_TOKEN_KEY } from '../auth/Utils/constants';

import { Auth } from 'aws-amplify';

type State = {};

type Props = {
  pathName: string;
  match: {
    params: {
      date: string;
    }
  }
}

class Menubar extends Component<Props, State> {
  state = {
    dropdownMenuStyle: {
        display: "none"
    }
  };
    
  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };

  cartSum = (cart: Array<CartItem>) => {
    let totalItems = 0;
    let el;

    for (el of cart) {
      totalItems += el.quantity;
    }
    return totalItems;
  };

  render() {
    const pathName = moment(this.props.match.params.date, "DDMMYYYY").isValid() ? this.props.pathName : "/main"
    const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));
    // if (checkUserAuth) {
    //   Auth.currentAuthenticatedUser()
    //     .then((res) => {
    //       console.log(res)
    //     })
    // }
    return (
      <div>
        <Grid padded className="tablet computer only">
          <Menu borderless fluid inverted size="huge">
            <Container>
              <Link to="/">
                <Menu.Item header as="a" >
                  Hawker Deliveries
                </Menu.Item>
              </Link>
              <Link to={pathName}>
                <Menu.Item as="a">
                  Home
                </Menu.Item>
              </Link>
              <Menu.Item position="right" as="a">
                <Link to={checkUserAuth ? `${pathName}/dashboard` : "/login"}>
                  {checkUserAuth ? "Account" : "Login"}
                </Link>
              </Menu.Item>        
              <Link to={`${pathName}/cart`}>
                <Menu.Item as="a">
                <Icon name="cart" />
                  <CartContext.Consumer>
                    {({cart, modifyCart}) => ( 
                      <p> Cart ({this.cartSum(cart)}) </p>
                    )}
                  </CartContext.Consumer>
                </Menu.Item>
              </Link>
            </Container>
          </Menu>
        </Grid>
        <Grid padded className="mobile only">
          <Menu borderless fluid inverted size="huge">
            <Menu.Item header as="a" href="/">
              Hawker Deliveries
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                <Button
                  icon
                  inverted
                  basic
                  toggle
                  onClick={this.handleToggleDropdownMenu}
                >
                  <Icon name="content" />
                </Button>
              </Menu.Item>
            </Menu.Menu>
            <Menu
              borderless
              fluid
              inverted
              vertical
              style={this.state.dropdownMenuStyle}
            >
              <Link to={pathName}>
                <Menu.Item as="a">
                  Home
                </Menu.Item>
              </Link>
              <Link to={checkUserAuth ? `${pathName}/dashboard` : "/login"}>
                <Menu.Item as="a">{checkUserAuth ? "Account" : "Login"}</Menu.Item>        
              </Link>
              <Link to={`${pathName}/cart`}>
                <Menu.Item as="a">
                  <CartContext.Consumer>
                    {({cart, modifyCart}) => ( 
                      <p><Icon name="cart"/> Cart ({this.cartSum(cart)})  </p>
                    )}
                  </CartContext.Consumer>
                </Menu.Item>
              </Link>
            </Menu>
          </Menu>
        </Grid>
      </div>
    );
  }
}

Menubar.contextType = CartContext

export default Menubar