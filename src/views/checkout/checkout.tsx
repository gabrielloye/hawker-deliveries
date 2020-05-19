import React, { Component, createRef } from "react";

import "semantic-ui-css/semantic.min.css";

import { Link } from 'react-router-dom';

import { Responsive, Button, Container, Menu, Sticky } from "semantic-ui-react";

import './checkout.css';


import { authCode, redirectURI } from '../../components/sandboxoauth';

type Props = {
    location: {
        search: string
    }
}

type State = {
    response: string
}

class Checkout extends Component<Props> {
  state= {
      response: ''
  }

  async componentDidMount() {
    let queryString = this.props.location.search;
    queryString = queryString.split('&')[0];
    let accessCode = queryString.split('=')[1];
    let fetchToken = {
          method: 'POST',
          body: `code=${accessCode}&grant_type=authorization_code&redirect_uri=${redirectURI}`,
          headers: {
              'authorization': `Basic ${authCode}`,
              'content-type': 'application/x-www-form-urlencoded',
              'cache-control': 'no-cache',
              'accept': 'application/json',
          }
    }
    let response = fetch('https://www.dbs.com/sandbox/api/sg/v1/oauth/tokens', fetchToken);
    this.setState({
        response: response
    })
  }

  render() {
    return (
    <h1>Here:</h1>
    );
  }
}


export default Checkout;