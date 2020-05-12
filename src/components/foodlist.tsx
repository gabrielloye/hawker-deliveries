import React from 'react';
import ProductQuantity from './productquantity';

export interface FoodItem {
    id: string;
    name: string;
    image: string;
    price: number;
    description: string;
}

type Props = {
    store: Array<FoodItem>;
}

class FoodList extends React.Component<Props> {
    displayListPosts = () =>
    this.props.store.map((el : FoodItem) => (
        <div className="column">
        <div className="ui fluid card">
        <div className="image">
          <img src={el.image}/>
        </div>
        <div className="content">
          <a className="header">{ el.name }</a>
          <div className="meta">
            <span className="date">{ el.price }</span>
          </div>
          <div className="description">
            { el.description }
          </div>
        </div>
        <div className="extra content">
          <ProductQuantity item={el} quantity={0}></ProductQuantity>
        </div>
      </div>
      </div>
  ));

  render() {
    return (<div className="ui three column grid">{ this.displayListPosts() }</div>)
  }
}

export default FoodList