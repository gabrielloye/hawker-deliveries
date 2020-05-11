import React, {Component} from "react";
import moment from 'moment';
import { Button, Dropdown } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css";

class Datepicker extends Component {
  state = {
    date: moment()
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

        <Dropdown
          button
          className="huge"
          selection
          options={this.options}
          defaultValue={this.options[0].value}/>
        <Link to={`/main/${this.state.date.format('DDMMYYYY')}`}>
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