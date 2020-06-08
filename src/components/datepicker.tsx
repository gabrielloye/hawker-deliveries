import 'react-dates/initialize';
import React, {Component} from "react";
import moment from 'moment';
import { Button, Dropdown, DropdownProps, Grid, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';
import "semantic-ui-css/semantic.min.css";

const options = [
  {
    key: "Cinnamon",
    text: "Cinnamon",
    value: "Cinnamon"
  },
  {
    key: "Tembusu",
    text: "Tembusu",
    value: "Tembusu"
  }
]

class Datepicker extends Component {
  state = {
    date: moment(),
    zone: options[0]['value'],
    focused: false
  };

  
  onZoneSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ zone: data.value })
  }
  

  render() {
    return (
      <Grid>
        <Grid.Row centered columns={3} style={{"margin": "0.5em 0"}}>
          <Grid.Column tablet={6} computer={6} mobile={8}>
            <SingleDatePicker
              id="1"
              orientation= "horizontal"
              anchorDirection = "right"
              date={this.state.date}
              onDateChange={(date) => this.setState({ date })}
              focused={this.state.focused}
              onFocusChange={({ focused }) => this.setState({ focused })}
              numberOfMonths={1}
              isOutsideRange={day =>
              !isInclusivelyAfterDay(day, moment()) ||
              isInclusivelyAfterDay(day, moment().add(4, 'days'))}
              displayFormat="DD/MM/YYYY">
            </SingleDatePicker>
          </Grid.Column>
          <Grid.Column tablet={5} computer={5} mobile={8}>
            <Dropdown
              style={{"height":"100%", "lineHeight": "unset"}}
              button
              fluid
              selection
              options={options}
              onChange={this.onZoneSelect}
              value={this.state.zone}/>
          </Grid.Column>
          <Grid.Column tablet={5} computer={5} mobile={12}>
            <Link to={`/main/${moment(this.state.date).format('DDMMYYYY')}/lunch/${this.state.zone}`}>
              <Button animated='vertical' style={{"marginTop":"0.2em"}} fluid size="big">
                <Button.Content visible>
                  Make Your Order
                </Button.Content>
                <Button.Content hidden>
                  <Icon name='shop'/>
                  Let's Go!
                </Button.Content>
              </Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const optionsStyle = {
  borderRadius: "1em",
  padding: "0em",
  display: "flex",
  flexFlow: "row wrap",
  justifyContent: "space-around",
  alignItems: "center"
}

export default Datepicker