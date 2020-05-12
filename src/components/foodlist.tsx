import React from 'react';
import { Card, Image } from 'semantic-ui-react'
import { Button, Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import ProductQuantity from './productquantity';

export interface FoodItem {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
}

type Props = {
    name: string;
    address: string;
    store: Array<FoodItem>;
}

class FoodList extends React.Component<Props> {
    displayListPosts = () =>
    this.props.store.map((el : FoodItem) => (
      <Card
          image={ el.image }
          header={ el.name }
          meta= { `$${el.price.toFixed(2)}` }
          description={el.description}
          extra={ <ProductQuantity item={el} quantity={0}></ProductQuantity> }
          fluid={ true }
      />
  ));

  render() {
    return (
      <React.Fragment>
        <Container text textAlign="center">
          <Header size="huge">{this.props.name}</Header>
          <p className="lead">
            { this.props.address }
          </p>
          <Card.Group itemsPerRow="2" stackable>
            { this.displayListPosts() }
          </Card.Group>
        </Container> 
      </React.Fragment>
    )
  }
}

export default FoodList