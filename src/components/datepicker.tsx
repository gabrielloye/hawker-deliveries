import 'react-dates/initialize';
import React, {Component} from "react";
import moment, {Moment} from 'moment';
import { Button, Dropdown, Container } from "semantic-ui-react";
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
          defaultValue={this.options[0].value}/>
        <Link to={`/main/${moment(this.state.date).format('DDMMYYYY')}/lunch`}>
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