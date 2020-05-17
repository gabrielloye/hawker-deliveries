import 'react-dates/initialize';
import React from "react";
import { Dimmer, Card } from 'semantic-ui-react'
import { Icon, Container, Header, Transition } from "semantic-ui-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIceCream, faCookieBite, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';
import './hawkerlist.css';

import axios from 'axios';

import 'react-dates/lib/css/_datepicker.css';

interface Listing {
  date: string;
  code: string;
  address: string;
  image: string;
  meal: string;
  name: string;
  orderAvailable: boolean;
  stalls: Stall[]
}

interface Stall {
  available: boolean;
  food: any[];
  image: string;
  name: string;
  stallId: string;
  type: string[];
}

type State = {
  focused: boolean | null;
  date: Moment| null;
  visible: boolean;
  listing: Listing | null
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
    visible: false,
    listing: {
      date: "",
      code: "",
      address: "",
      image: "",
      meal: "",
      name: "",
      orderAvailable: false,
      stalls: []
    }
  }

  componentDidMount() {
    if (this.state.date.isValid()){
      this.fetchListing(this.state.date).then( (res: any) => {
        const data: Listing = res['data']
        if (data) {
          this.setState({
            listing: data,
            visible: true
          })
        } else {
          this.setState({visible: true})
        }
      })
    } else {
      this.props.history.push('/')
    }
  }

  renderCards = () =>{
    if (this.state.listing.stalls.length !== 0) {
      const cards = this.state.listing.stalls.map((stall: Stall) => {
        const type: string = stall['type'][0].toLowerCase()
        const imageurl = (stall.image !== "") ? stall.image : `https://hawker-images.s3-ap-southeast-1.amazonaws.com/generic_images/stall_${type}.jpg`
        
        return (
          
            <Card
              as={Link}
              to={`${this.props.match.url}/product/${stall.stallId}`}
              disabled = {!stall.available}
              childKey={stall.stallId}
              key={stall.stallId}
              fluid={true}>
                <div className="listingImage" style={{"backgroundImage":`url(${imageurl})`}}></div>
                <Card.Content>
                  <Card.Header>{stall.name}</Card.Header>
                  <Card.Meta>
                    {stall['type'].map((type: string)=>{
                      if (type.toLowerCase() === "drinks") {
                        return(<FontAwesomeIcon icon={faCoffee}></FontAwesomeIcon >)
                      } else if (type.toLowerCase() === "dessert") {
                        return(<FontAwesomeIcon icon={faIceCream}></FontAwesomeIcon>)
                      } else if (type.toLowerCase() === "snacks") {
                        return(<FontAwesomeIcon icon={faCookieBite}></FontAwesomeIcon>)
                      } else {
                        return(<Icon name="food"></Icon>)
                      }
                      })}
                  </Card.Meta>
                  <Card.Description>
                    {`$${Math.min(...stall.food.map(({ price }) => price)).toFixed(2)} ~ $${Math.max(...stall.food.map(({ price }) => price)).toFixed(2)}`}
                  </Card.Description>
                </Card.Content>
                <Dimmer active={!stall.available} inverted>
                  <Header as='h2' style={{"color":"black"}}>This stall is unavailable today</Header>
                </Dimmer>
            </Card>
            
          
          
      )})
      return <Card.Group itemsPerRow="2" stackable>{cards}</Card.Group>
    } else {
      return <p>Orders are not available for this date</p>
    }
  }

  fetchListing = (date: Moment) => {
    const promise: Promise<Listing> = axios.get("https://hb65mr6g85.execute-api.ap-southeast-1.amazonaws.com/dev/listings/"+date.format("DDMMYYYY"))
    return promise
  }

  dateChange = (date: Moment) => {
    if(this.state.date===null || this.state.date.format("DDMMYYYY")!==date.format("DDMMYYYY")) {
      this.props.history.push(`/main/${date.format("DDMMYYYY")}`)
      // this.setState({ date })
      // this.setState({visible: false})
      // this.fetchListing(date).then( (res: any) => {
      //   const data: Listing = res['data']
      //   if (data) {
      //     this.setState({
      //       listing: data,
      //       visible: true
      //     })
      //   } else {
      //     this.setState({visible: true})
      //   }
      // })
    }
  }

  render() {
    if (this.state.listing) {


    return (
      <div>
        <Container text textAlign="center">
          <Header size="huge">{this.state.listing.name}</Header>
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
           {this.renderCards()}
          </div>
          </Transition>
        </Container>
      </div>
    );
  }
  }
}

export default HawkerList