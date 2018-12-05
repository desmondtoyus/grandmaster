import React, { Component } from 'react';
import { Form, Icon, Button, Checkbox} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { changeFlight } from "../../redux/actions/flight.actions";
import classNames from 'classnames';

const days = [
  { text: "Sunday", value: "sunday" },
  { text: "Monday", value: "monday" },
  { text: "Tuesday", value: "tuesday" },
  { text: "Wednesday", value: "wednesday" },
  { text: "Thursday", value: "thursday" },
  { text: "Friday", value: "friday" },
  { text: "Saturday", value: "saturday" }
];

const times = [
  { text: "12:00 AM", value: 0 },
  { text: "1:00 AM", value: 1 },
  { text: "2:00 AM", value: 2 },
  { text: "3:00 AM", value: 3 },
  { text: "4:00 AM", value: 4 },
  { text: "5:00 AM", value: 5 },
  { text: "6:00 AM", value: 6 },
  { text: "7:00 AM", value: 7 },
  { text: "8:00 AM", value: 8 },
  { text: "9:00 AM", value: 9 },
  { text: "10:00 AM", value: 10 },
  { text: "11:00 AM", value: 11 },
  { text: "12:00 PM", value: 12 },
  { text: "1:00 PM", value: 13 },
  { text: "2:00 PM", value: 14 },
  { text: "3:00 PM", value: 15 },
  { text: "4:00 PM", value: 16 },
  { text: "5:00 PM", value: 17 },
  { text: "6:00 PM", value: 18 },
  { text: "7:00 PM", value: 19 },
  { text: "8:00 PM", value: 20 },
  { text: "9:00 PM", value: 21 },
  { text: "10:00 PM", value: 22 },
  { text: "11:00 PM", value: 23 }
];


class FlightParting extends Component {
  state={
    checked:false
  }

  renderDayParting = () => {
    const { dayParting } = this.props;

    return dayParting.map((item, index) => {
      return (
        <Form size="tiny" key={index}>
          <Form.Group inline>
            <Form.Select className={classNames("bwa-select-label2", { 'bwa-floated': item.startDay !== "" })} label="From Day" options={days} name="startDay" value={item.startDay} onChange={this.handleDayPartingSelect.bind(null, index)} error={item.errorStartDay} />
            <Form.Select className={classNames("bwa-select-label2", { 'bwa-floated': item.endDay !== "" })} label="To Day" options={days} name="endDay" value={item.endDay} onChange={this.handleDayPartingSelect.bind(null, index)} error={item.errorEndDay} />
            <Form.Select className={classNames("bwa-select-label2", { 'bwa-floated': item.startTime !== "" })} label="From Time" options={times} name="startTime" value={item.startTime} onChange={this.handleDayPartingSelect.bind(null, index)} error={item.errorStartTime} />
            <Form.Select className={classNames("bwa-select-label2", { 'bwa-floated': item.endTime !== "" })} label="To Time" options={times} name="endTime" value={item.endTime} onChange={this.handleDayPartingSelect.bind(null, index)} error={item.errorEndTime} />
            <Button basic icon="minus" size="mini" onClick={this.removeDayPartingRow.bind(null, index)} />
          </Form.Group>
        </Form>
      )
    })
  };

  handleDayPartingSelect = (index, event, data) => {
    const { dayParting } = this.props;
    const arr = [...dayParting];
    arr[index][data.name] = data.value;
    this.props.changeFlight({ prop: 'dayParting', value: arr });
  };

  addDayPartingRow = () => {
    const { dayParting } = this.props;
    const arr = [...dayParting];
    arr.push({
      id: 0,
      startDay: "",
      startTime: "",
      endDay: "",
      endTime: "",
      errorStartDay: false,
      errorStartTime: false,
      errorEndDay: false,
      errorEndTime: false
    });
    this.props.changeFlight({ prop: 'dayParting', value: arr });
  };


  removeDayPartingRow = (index, event) => {
    event.preventDefault();

    const { dayParting } = this.props;
    let arr = [...dayParting];
    if (arr.length === 1) {
      arr = [{
        id: 0,
        startDay: "",
        startTime: "",
        endDay: "",
        endTime: "",
        errorStartDay: false,
        errorStartTime: false,
        errorEndDay: false,
        errorEndTime: false
      }];
    }
    else {
      arr.splice(index, 1);
    }
    this.props.changeFlight({ prop: 'dayParting', value: arr });
  };
handleChecked =()=>{
  this.setState({checked:!this.state.checked})
}
  

  render() {
    const {renderCheckboxStyle} = styles;
    return (
      <div>
         <Checkbox style={renderCheckboxStyle} label="Day and Time Parting" checked={this.state.checked || this.props.dayParting[0].startDay !==""} onClick={this.handleChecked}/>
      {this.state.checked || this.props.dayParting[0].startDay !=="" ? <div style={{marginTop:'10px'}}><h4>Day and Time Parting <Icon name='plus square outline' size='large' onClick={this.addDayPartingRow} style={{cursor:'pointer'}} /></h4>  <div className='form'>
      <br/>
      <div className='form__half'>
        <div className='form__inside' >
        {this.renderDayParting()}
      </div>
      </div>
      </div> </div> :null}
      </div>
    )
  }
}


const styles = {
  renderCheckboxStyle: {
    paddingTop: "7px",
    marginRight: "6px",
    marginLeft: "0"
  }
};

const mapStateToProps = state => {
  const {  dayParting } = state.flight;
  return {  dayParting };
};

export default connect(mapStateToProps, { changeFlight })(FlightParting);
