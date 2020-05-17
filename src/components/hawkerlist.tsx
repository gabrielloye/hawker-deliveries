import 'react-dates/initialize';
import React from "react";
import { Card } from 'semantic-ui-react'
import { Container, Header, Transition } from "semantic-ui-react";
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';

import axios from 'axios';

import 'react-dates/lib/css/_datepicker.css';

interface Product {
    id: string;
    name: string;
    image: string;
    min_price: number;
    max_price: number;
}

type State = {
  products: Array<Product>;
  focused: boolean | null;
  date: Moment;
  visible: boolean
}

type Props = RouteComponentProps & {
    match: {
      url: string
      params: {
          date: string
      }
    }
}

class HawkerList extends React.Component<Props, State> {
  state={
    focused: false,
    date: moment(this.props.match.params.date, "DDMMYYYY"),
    products: [],
    visible: false
  }

  componentDidMount() {
    this.fetchProducts(this.state.date).then( (res: any) => {
      const products: Product[] = res['data']['products']
      this.setState({ products })
      this.setState({ visible: true})
    })
  }

  renderCards = () =>{
    if (this.state.products!==[]) {
      console.log("Here")
      return this.state.products.map((product: Product) => (
      <Card
        as={Link}
        to={`${this.props.match.url}/product/${product.id}`}
        childKey={product.id}
        image={product.image}
        header={product.name}
        meta={`$${product.min_price.toFixed(2)} ~ $${product.max_price.toFixed(2)}`}
        fluid={true}/>
    ))} else {
      return <p>Orders are not available for this date</p>
    }
    }
  fetchProducts = (date: Moment) => {
    const promise: Promise<Product[]> = axios.get("https://hb65mr6g85.execute-api.ap-southeast-1.amazonaws.com/dev/main/"+date.format("DDMMYYYY"))
    return promise
  }

  dateChange = (date: Moment) => {
    if(this.state.date.format("DDMMYYYY")!==date.format("DDMMYYYY")) {
      this.props.history.push(`/main/${date.format("DDMMYYYY")}`)
      this.setState({ date })
      this.setState({visible: false})
      this.fetchProducts(date).then( (res: any) => {
        const products: Product[] = res['data']['products']
        this.setState({ products })
        this.setState({visible: true})
      })
    }
  }

  render() {

    return (
      <div>
        <Container text textAlign="center">
          <Header size="huge">Tanglin Halt Market</Header>
          <p className="lead">
            These are the stalls available for Lunch on: 
          <SingleDatePicker
            id="2"
            orientation= "horizontal"
            anchorDirection = "right"
            date={this.state.date}
            onDateChange={(date)=>{if(date){this.dateChange(date)}}}
            focused={this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused })}
            numberOfMonths={1}
            isOutsideRange={day =>
            !isInclusivelyAfterDay(day, moment()) ||
            isInclusivelyAfterDay(day, moment().add(4, 'days'))}
            displayFormat="DD/MM/YYYY"
            small={true}> 
          </SingleDatePicker>
          </p>
          
          <Transition visible={this.state.visible} animation='scale' duration={500}>
          <div>
          { this.state && this.state.products &&
           <Card.Group itemsPerRow="2" stackable>
           {this.renderCards()}
         </Card.Group>}
          </div>
          </Transition>
        </Container>
      </div>
    );
  }
}

export default HawkerList