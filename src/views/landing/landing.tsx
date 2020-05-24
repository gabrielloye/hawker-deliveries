import React, { Component } from "react";

import { Link } from 'react-router-dom'

import { Icon, Container, Header, Menu, Segment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import Datepicker from '../../components/datepicker';

import "./landing.css";

/** Helpers */
import { validateToken } from '../../auth/Utils/Helpers';

/** Constants */
import { AUTH_USER_TOKEN_KEY } from '../../auth/Utils/constants';

class LandingPage extends Component {

  render() {
    const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <Container as="nav">
            <Header inverted as="h1">
              HawkerJio
            </Header>
            <Menu borderless compact inverted>
              <Menu.Item active>Home</Menu.Item>
              <Link to={checkUserAuth ? "/main/dashboard" : "/login"}>
                <Menu.Item as="a">{checkUserAuth ? "Account" : "Login"}</Menu.Item>
              </Link>
              <Link to="/main/about">
                <Menu.Item as="a">About</Menu.Item>
              </Link>
            </Menu>
          </Container>
          <Container className="content">
            <Header inverted as="h1">
              Select Order Date
            </Header>
            <Datepicker></Datepicker>
            <Segment inverted style={{"marginTop": 0, "backgroundColor": "transparent", "textAlign": "justify"}}>
            Over this challenging period, many hawkers have faced a considerable drop in business; Furthermore, some of them are unable to make use of the food delivery applications due to the technological barriers or high fees/commissions. 
            <br/>
            Hence, in support of our local hawkers, ‘HawkerJio’ aims to pool orders from each Hawker Centre - all without taking commissions from our hawker & delivery partners.
            <br/>
            Do support our SG hawkers by making your order soon! More about us & our story can be found on the “About” tab too!
            </Segment>
          </Container>
          <Segment inverted vertical as="footer">
            by{" "}
            <a href="https://github.com/gabrielloye/hawker-deliveries">
              @HawkerJio Team <Icon name='github'></Icon>
            </a>
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default LandingPage;