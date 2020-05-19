import React, { Component } from 'react';

import "semantic-ui-css/semantic.min.css";

import API from '../../components/axiosapi';
import './store.css';
import FoodList, { FoodItem } from "../../components/foodlist";
import { Container, Header, Loader } from 'semantic-ui-react';

type State = {
  name: string,
  image: string,
  stallId: string,
  stallNo: string,
  type: string[],
  food: any[],
  contact: any,
  about: any
}

type Props = {
  match: {
    params: {
        productId: number,
        date: string
    }
  }
}


class Store extends Component<Props, State> {
  state = {
    name: "",
    image: "",
    stallId: "",
    stallNo: "",
    type: [],
    food: [],
    contact: {},
    about: {}
  };

  componentDidMount() {
    const promise: Promise<any> = API.get(`stalls/${this.props.match.params.productId}`)
    promise.then((res) => {
      const data = res['data']
      this.setState({
        name: data['name'],
        image: data['image'],
        stallId: data['stallId'],
        stallNo: data['stallNo'],
        type: data['type'],
        food: data['food'],
        contact: data['contact'],
        about: data['about']
      })
    })
  }

  render() {
    if (this.state.name) {
      return (
        <div className="App">
          <Container text textAlign="center">
            <Header size="huge">{this.state.name}</Header>
            <p className="lead">
              #{ this.state.stallNo }
            </p>
            <FoodList stallId={this.state.stallId} store={this.state.food}/>
          </Container>
      </div>
      );
    } else {
      return <Loader active>Loading</Loader>
    }
  }
}
  
export default Store;