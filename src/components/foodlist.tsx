import React from 'react';
import { Card, Image } from 'semantic-ui-react'
import { Tab, Label, Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import ProductQuantity from './productquantity';
import SimpleSlider from './abouthawker'

export interface FoodItem {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
    quantity: number;
}

type Props = {
    store: Array<FoodItem>;
}

class FoodList extends React.Component<Props> {

  renderTabPanes = () => [
    {
      menuItem: { key: 'menu', icon: 'food', content: 'Menu' },
      render: () => <Tab.Pane><Card.Group itemsPerRow="2" stackable>
        { this.displayListPosts() }
      </Card.Group></Tab.Pane>
    },
    {
      menuItem: { key: 'about', icon: 'info', content: "About"},
      render: () => <Tab.Pane>
        <Container>
          <SimpleSlider></SimpleSlider>
        </Container>
        <Container>
        Located near the Chinatown/CBD region, the owners of the stall are Mr & Mrs Ng (whose daughter is one of us, a CAPTain from Phoenix!!!) who have been selling their Prawn Mee for almost 10 years 🦐 
        <br/>The soup has been boiled for many hours to ensure maximum yumminess! Do try it for yourself 🤩☺️🍜🍤
        <ul>
          <li>
            "Soup" orders will have the soup separated in a packet by the side
          </li>
          <li>
            "Dry" orders will still receive a packet of soup to be enjoyed at the side; but with a special sauce mix added to the 'dry' version of the noodles
          </li>
        </ul>
        </Container>
        
      </Tab.Pane>
    },
    {
      menuItem: { key: 'contact', icon: 'phone', content: "Contact"},
      render: () => <Tab.Pane>Current Unavailable</Tab.Pane>
    }
  ]

  displayListPosts = () =>
    this.props.store.map((el : FoodItem) => {
      const image = el.image!=="" ? el.image : "https://hawker-images.s3-ap-southeast-1.amazonaws.com/generic_images/placeholder.png"
      return (
        <Card
          image={ image }
          header={ el.name }
          meta= { `$${el.price.toFixed(2)}` }
          description={el.description}
          extra={ <ProductQuantity maxQuantity={el.quantity} item={el} quantity={0}></ProductQuantity> }
          fluid={ true }
        />
      )
    });

  render() {
    return (
      <Tab menu={{ attached: false, tabular: false, widths: 3 }} panes={this.renderTabPanes()}/>
    )
  }
}

export default FoodList