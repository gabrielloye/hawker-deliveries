import React, { Component } from "react";

import "semantic-ui-css/semantic.min.css";

import { Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";

import './main.css';

import HawkerList from '../../components/hawkerlist'

import moment from 'moment';

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

type State = {
    dropdownMenuStyle: {
        display: string;
    }
};

type Props = {
    match: {
        params: {
            date: string
        }
    }
}

class Main extends Component<Props, State> {
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

  render() {
    return (
      <div className="App">
        <Grid padded className="tablet computer only">
          <Menu borderless fluid inverted size="huge">
            <Container>
              <Menu.Item header as="a" href="/">
                Hawker Deliveries
              </Menu.Item>
              <Menu.Item active as="a" href="/" position="right">
                Home
              </Menu.Item>
              {/* <Menu.Item as="a" href="#root">
                About
              </Menu.Item>
              <Menu.Item as="a" href="#root">
                Contact
              </Menu.Item> */}
              <Menu.Item as="a" href="/login">
                Login
              </Menu.Item>
              <Menu.Item href="cart">
                <Icon name="cart" /> Cart
              </Menu.Item>
            </Container>
          </Menu>
        </Grid>
        <Grid padded className="mobile only">
          <Menu borderless fluid inverted size="huge">
            <Menu.Item header as="a" href="#root">
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
              <Menu.Item active as="a" href="#root">
                Home
              </Menu.Item>
              <Menu.Item as="a" href="#root">
                About
              </Menu.Item>
              <Menu.Item as="a" href="#root">
                Contact
              </Menu.Item>
              <Menu.Item as="a" href="login">
                Login
              </Menu.Item>
            </Menu>
          </Menu>
        </Grid>
        <Container text textAlign="center">
          <Header size="huge">Tanglin Halt Market</Header>
          <p className="lead">
            These are the stalls available for {moment(this.props.match.params.date, "DDMMYYYY").format("Do MMMM YYYY")} Lunch
          </p>
          <HawkerList products={products}></HawkerList>
        </Container>
      </div>
    );
  }
}

export default Main;