import 'react-dates/initialize';
import React, {Component} from "react";
import moment from 'moment';
import { Button, Dropdown, DropdownProps } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';
import "semantic-ui-css/semantic.min.css";

class Datepicker extends Component {
  state = {
    date: moment(),
    zone: 'Tembusu',
    focused: false
  };

  options = [
    {
      key: "Temubusu",
      text: "Tembusu",
      value: "Tembusu"
    },
    
    {
      key: "Cinnamon",
      text: "Cinnamon",
      value: "Cinnamon"
    }
  ]

  
  onZoneSelect = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    this.setState({ zone: data.value })
  }
  

  render() {
    return (
      <div style={optionsStyle}>
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
        <Dropdown
          style={{margin:"1em 0"}}
          button
          className="huge"
          selection
          options={this.options}
          onChange={this.onZoneSelect}
          defaultValue={this.options[0].value}/>
        <Link to={`/main/${moment(this.state.date).format('DDMMYYYY')}/lunch/${this.state.zone}`}>
          <Button size="huge">Make Your Order</Button>
        </Link>
      </div>
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