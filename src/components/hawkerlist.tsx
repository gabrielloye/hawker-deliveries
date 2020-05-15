import React from "react";
import { Card, Image } from 'semantic-ui-react'
import { Container, Grid, Header, Icon, Menu } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import moment from 'moment';

interface Product {
    id: string;
    name: string;
    image: string;
    min_price: number;
    max_price: number;
}

const mapProductsToItems = (products: Array<Product>, path: string) =>
  products.map(({ id, name, image, min_price, max_price }) => {

    return {
      childKey: id,
      image,
      header: name,
      meta: `$${min_price.toFixed(2)} ~ $${max_price.toFixed(2)}`,
      fluid: true,
      href: `${path}/product/${id}`
    }
  })

type State = {}

type Props = {
    products: Array<Product>;
    
    match: {
      url: string
      params: {
          date: string
      }
    }
}

class HawkerList extends React.Component<Props, State> {

  getHawkerList = () => {
    
  }

  renderCards = () =>
    this.props.products.map(({id, name, image, min_price, max_price}) => (
      <Card
        as={Link}
        to={`${this.props.match.url}/product/${id}`}
        childKey={id}
        image={image}
        header={name}
        meta={`$${min_price.toFixed(2)} ~ $${max_price.toFixed(2)}`}
        fluid={true}/>
    ))

  render() {
    return (
      <React.Fragment>
        <Container text textAlign="center">
          <Header size="huge">Tanglin Halt Market</Header>
          <p className="lead">
            These are the stalls available for {moment(this.props.match.params.date, "DDMMYYYY").format("Do MMMM YYYY")} Lunch
          </p>
          <Card.Group itemsPerRow="2" stackable>
            {this.renderCards()}
          </Card.Group>
        </Container>
      </React.Fragment>
    );
  }
}

export default HawkerList