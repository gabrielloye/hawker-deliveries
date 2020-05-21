import React, { Component } from 'react';

import "semantic-ui-css/semantic.min.css";

import API from '../../components/axiosapi';
import './store.css';
import FoodList from "../../components/foodlist";
import { Button, Container, Header, Loader, Icon, Grid, Divider, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
        date: string,
        meal: string,
        zone: string
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
    about: {
      description: ""
    }
  };

  componentDidMount() {
    const promise: Promise<any> = API.get(
      `listings/${this.props.match.params.date}/${this.props.match.params.meal}/${this.props.match.params.zone}/stall/${this.props.match.params.productId}`
    )
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
            <Grid>
              <Grid.Row columns={1}>
                <Button color='black' as={Link} to={`/main/${this.props.match.params.date}/${this.props.match.params.meal}/${this.props.match.params.zone}`} icon labelPosition='left' floated="left">
                  <Icon name='arrow left'/>
                  Back to Stalls
                </Button>
              </Grid.Row>
            </Grid>

            <Header size="huge">{this.state.name}</Header>
            <p className="lead">
              #{ this.state.stallNo }
            </p>
            {this.state.about['description'].length>0?
            <Message warning>
              {this.state.about['description']}
            </Message>:null}
            <FoodList stallId={this.state.stallId} store={this.state.food}/>
            <Divider hidden/>
            <Button color='black' as={Link} to={`/main/${this.props.match.params.date}/${this.props.match.params.meal}/${this.props.match.params.zone}`} icon labelPosition='left' floated="left">
              <Icon name='arrow left'/>
              Back to Stalls
            </Button>
            <Divider hidden/>
            <Divider hidden/>
          </Container>
      </div>
      );
    } else {
      return (
        <div className="App">
          <Container textAlign="center" style={{"padding": "8em"}}>
            <Header><Loader active>Loading</Loader></Header>
          </Container>
      </div>
      )
    }
  }
}
  
export default Store;