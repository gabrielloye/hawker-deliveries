import 'react-dates/initialize';
import React, {Component} from "react";
import moment, {Moment} from 'moment';
import { Button, Dropdown } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { SingleDatePicker, isInclusivelyAfterDay } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';
import "semantic-ui-css/semantic.min.css";

class Datepicker extends Component {
  state = {
    date: moment(),
    focused: false
  };

  options = [
    {
      key: "Temubusu/Cinnamon",
      text: "Tembusu/Cinnamon",
      value: "Tembusu/Cinnamon"
    }
  ]
  

  render() {
    return (
      <div style={optionsStyle}>
        <SingleDatePicker
          id="1"
          date={this.state.date}
          onDateChange={(date) => this.setState({ date })}
          focused={this.state.focused}
          onFocusChange={({ focused }) => this.setState({ focused })}
          numberOfMonths={1}
          isOutsideRange={day =>
          !isInclusivelyAfterDay(day, moment()) ||
          isInclusivelyAfterDay(day, moment().add(4, 'days'))
        }>
        </SingleDatePicker>
        <Dropdown
          button
          className="huge"
          selection
          options={this.options}
          defaultValue={this.options[0].value}/>
        <Link to={`/main/${moment(this.state.date).format('DDMMYYYY')}`}>
          <Button size="huge">Make Your Order</Button>
        </Link>
      </div>
    );
  }
}

const optionsStyle = {
  borderRadius: "1em",
  padding: "1em",
  display: "flex",
  justifyContent: "space-around"
}

export default Datepicker