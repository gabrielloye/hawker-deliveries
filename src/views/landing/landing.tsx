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
            <Header inverted as="h2">
              Select Order Date
            </Header>
            <Datepicker></Datepicker>
            <Segment inverted style={{"marginTop": 0, "backgroundColor": "transparent", "textAlign": "justify"}}>
              While many food outlets are able to capitalise on online food delivery applications, some hawker stalls have not done so, possibly due to technological barriers and high commission fees.
              
              The drop in business during this period for these hawkers is concerning as social distancing measures will continue to be enforced.
              <br/>
              Therefore, in support of our local hawkers, HawkerJio aims to pool orders for these stalls at an extremely affordable fee! Make your order today!
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