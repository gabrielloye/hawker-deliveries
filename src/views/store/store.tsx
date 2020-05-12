import React, { Component } from 'react';

import "semantic-ui-css/semantic.min.css";

import { Container, Header } from 'semantic-ui-react';

import './store.css';
import Menubar from '../../components/menubar';
import FoodList, { FoodItem } from "../../components/foodlist";

interface storeInfo {
  name : string;
  address : string;
  about : string;
  itemList : Array<FoodItem>;
}

const stores : storeInfo[] = [
    {
      name: "Da Xi Hainanese Chicken Rice",
      address: "21 Tanglin Road",
      about: "Traditional chicken rice shop",
      itemList: [
          {
              id: "1",
              name: "Roasted Chicken Rice",
              image: "https://i.pinimg.com/originals/e5/d6/85/e5d685f5e24f9837e7dd22e2f8e1c617.jpg",
              price: 3.50,
              description: "Fragrant chicken rice with roasted chicken"
          },
          {
            id: "2",
            name: "Steamed Chicken Rice",
            image: "https://www.thespruceeats.com/thmb/vwIkJwmNwy55CJDYd11enCK5VB0=/960x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hainanese-chicken-rice-very-detailed-recipe-3030408-hero-0a742f08c72044e999202a44e30a1ea7.jpg",
            price: 4.00,
            description: "Fragrant chicken rice with roasted chicken"
        },
        {
          id: "3",
          name: "Thai Lemon Chicken Rice",
          image: "https://burpple.imgix.net/foods/2ebbb4a1a5e741b771f61620518_original.?w=645&dpr=1&fit=crop&q=80&auto=format",
          price: 4.50,
          description: "Fragrant chicken rice with roasted chicken"
      },
      ]
    },
    {
      name: "Ta Lu Prawn Noodles Stall",
      address: "21 Tanglin Road",
      about: "Traditional chicken rice shop",
      itemList: []
    },
    {
      name: "Wei Yi Laksa",
      address: "21 Tanglin Road",
      about: "Traditional chicken rice shop",
      itemList: []
    }
  ]

  type State = {}

type Props = {
  match: {
    params: {
        productId: number
    }
}
}


class Store extends Component<Props, State> {
    state = {
      store: stores[this.props.match.params.productId - 1]
    };
  
    render() {
      return (
        <div className="App">
          <Container text textAlign="center">
          <Header size="huge">{this.state.store.name}</Header>
          <p className="lead">
            { this.state.store.address }
          </p>
          <FoodList store={this.state.store.itemList}></FoodList>
        </Container> 
      </div>
      );
    }
  }
  
  export default Store;