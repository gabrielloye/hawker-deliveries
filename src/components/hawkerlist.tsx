import 'react-dates/initialize';
import React from "react";
import { Dimmer, Card, Dropdown, DropdownProps, Divider, Progress } from 'semantic-ui-react'
import { Loader, Icon, Container, Header, Transition } from "semantic-ui-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIceCream, faCookieBite, faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Link, RouteComponentProps } from 'react-router-dom';
import moment, { Moment } from 'moment';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';
import './hawkerlist.css';

import API from '../components/axiosapi';

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
  minOrder: number | null;
}

type State = {
  focused: boolean | null;
  date: Moment| null;
  visible: boolean;
  listing: Listing | null;
  meal: string;
}

type Props = RouteComponentProps & {
    match: {
      url: string
      params: {
          date: string;
          meal : string;
          zone: string;
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
    },
    meal: this.props.match.params.meal,
    zone: this.props.match.params.zone
  }

  componentDidMount() {
    if (this.state.date.isValid()) {
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
        //TEMP
        console.log(stall['name'])
        if (stall['name'] === "Gong Cha") {
          stall['minOrder'] = 30
        } else {
          stall['minOrder'] = -1
        }
        //
        let type: string = "food"
        if (stall['type'].length>0) {
          type = stall['type'][0].toLowerCase()
        }
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
                    {`$${Math.min(...stall.food.map(({ price, margin }) => price + margin)).toFixed(2)} ~ $${Math.max(...stall.food.map(({ price, margin }) => price + margin)).toFixed(2)}`}
                  </Card.Description>
                </Card.Content>
                {stall['minOrder']>0?
                <Card.Content extra>
                  <Header as='h5' style={{"textAlign": 'left'}}>
                    Minimum Total Orders
                  </Header>
                  <Progress
                    indicating
                    value='17'
                    total={stall['minOrder']}
                    progress='ratio' />
                </Card.Content>:
                <Card.Content extra>
                  <Header as='h5'>
                    No minimum total orders required
                  </Header>  
                </Card.Content>}
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
    const promise: Promise<any> = API.get("listings/get/"+date.format("DDMMYYYY")+"/"+this.state.meal + "/" + this.state.zone)
    return promise
  }

  onMealSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.props.history.push(`/main/${this.state.date.format("DDMMYYYY")}/${data.value}/${this.state.zone}`)
  }

  onZoneSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.props.history.push(`/main/${this.state.date.format("DDMMYYYY")}/${this.state.meal}/${data.value}`)
  }

  dateChange = (date: Moment) => {
    if(this.state.date===null || this.state.date.format("DDMMYYYY")!==date.format("DDMMYYYY")) {
      this.props.history.push(`/main/${date.format("DDMMYYYY")}/${this.state.meal}/${this.state.zone}`)
    }
  }

  render() {
    if (this.state.listing) {
      let mealOptions = [
        {
          key: 'lunch',
          text: 'Lunch',
          value: 'lunch'
        },
        {
          key: 'dinner',
          text: 'Dinner',
          value: 'dinner'
        }
      ]

      let zoneOptions = [
        {
          key: 'Tembusu',
          text: 'Tembusu',
          value: 'Tembusu'
        },
        {
          key: 'Cinnamon',
          text: 'Cinnamon',
          value: 'Cinnamon'
        }
      ]

    return (
      <div>
        <Container text textAlign="center">
          <Header size="huge">{this.state.listing.name}</Header>
          <p className="lead">
            These are the stalls available for
            <Dropdown
            style={{"marginLeft": "5px"}}
            compact
            placeholder='Select Meals'
            selection
            defaultValue={this.state.meal}
            options={mealOptions}
            onChange={this.onMealSelect}
          /> at
          <Dropdown
            style={{"marginLeft": "5px", "marginBottom": "0.3em"}}
            compact
            placeholder='Select Zone'
            selection
            defaultValue={this.state.zone}
            options={zoneOptions}
            onChange={this.onZoneSelect}
          /> on:
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
          {this.state.visible?"":<Loader active>Loading</Loader>}
        </Container>
      </div>
    );
  }
  }
}

export default HawkerList