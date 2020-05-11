import React from "react";
import { Card, Image } from 'semantic-ui-react'

interface Product {
    id: string;
    name: string;
    image: string;
    min_price: number;
    max_price: number;
}

const mapProductsToItems = (products: Array<Product>) =>
  products.map(({ id, name, image, min_price, max_price }) => {

    return {
      childKey: id,
      image,
      header: name,
      meta: `$${min_price} ~ $${max_price}`,
      fluid: true,
      href: `/product?id=${id}`
    }
  })

type State = {}

type Props = {
    products: Array<Product>;
}

class HawkerList extends React.Component<Props, State> {
  render() {
    return (<Card.Group items={mapProductsToItems(this.props.products)} itemsPerRow="2" stackable />)
  }
}

export default HawkerList