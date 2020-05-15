import React, { Component } from 'react';

import "semantic-ui-css/semantic.min.css";

import { Label, Menu, Tab } from 'semantic-ui-react';

import './store.css';
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
            image: "https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/e5d685f5e24f9837e7dd22e2f8e1c617.jpg",
            price: 3.50,
            description: "Fragrant chicken rice with roasted chicken"
        },
        {
          id: "2",
          name: "Steamed Chicken Rice",
          image: "https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/chickenrice_566x424_fillbg_1b71b0de73.jpg",
          price: 4.00,
          description: "Fragrant chicken rice with roasted chicken"
      },
      {
        id: "3",
        name: "Thai Lemon Chicken Rice",
        image: "https://hawker-images.s3-ap-southeast-1.amazonaws.com/dummyimages/2ebbb4a1a5e741b771f61620518_original_.jpg",
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

type State = {
  store: {
    name: string,
    address: string,
    about: string,
    itemList: Array<any>
  }
}

type Props = {
  match: {
    params: {
        productId: number
    }
  }
}


class Store extends Component<Props, State> {
  state = {
    //store: stores[this.props.match.params.productId - 1],
    store: stores[0]
  };

  render() {
    return (
      <div className="App">
        <FoodList 
          name={this.state.store.name} 
          address={this.state.store.address}
          store={this.state.store.itemList}
        />
    </div>
    );
  }
}
  
export default Store;