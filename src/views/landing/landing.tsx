import React, { Component, useState } from "react";

import { Container, Header, Menu, Segment } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import Datepicker from '../../components/datepicker';

import "./landing.css";

class LandingPage extends Component {

  render() {
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <Container as="nav">
            <Header inverted as="h1">
              Hawker Deliveries
            </Header>
            <Menu borderless compact inverted>
              <Menu.Item active>Home</Menu.Item>
              <Menu.Item as="a" href="/">Hawkers</Menu.Item>
              <Menu.Item as="a" href="/login">Log-in</Menu.Item>
              <Menu.Item as="a" href="/">Contact</Menu.Item>
            </Menu>
          </Container>
          <Container className="content">
            <Header inverted as="h1">
              Select Order Date
            </Header>
            <Datepicker></Datepicker>
            
          </Container>
          <Segment inverted vertical as="footer">
            by{" "}
            <a href="https://github.com/semantic-ui-forest">
              @CAPT Hawker Delivery
            </a>
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default LandingPage;