import React, { Component } from 'react';
import { Input, Select, Checkbox } from 'semantic-ui-react';
import classNames from 'classnames';

import { connect } from 'react-redux';
import { changeFlight } from "../../redux/actions/flight.actions";
import { Alert } from 'reactstrap';

import FlightTargeting from './flight.targeting';
import FlightCompliance from './flight.targetingsCompliance';
import FlightGeo from './flight.targetingsGeo';
import FlightParting  from "./flight.targetingsParting"
import FlightUserAgent from "./flight.targetingsUseragent";

const videoDuration = [
  { text: "0 Seconds", value: 0 },
  { text: "15 Seconds", value: 15 },
  { text: "30 Seconds", value: 30 },
  { text: "60 Seconds", value: 60 },
  { text: "90 Seconds", value: 90 },
  { text: "120+ Seconds", value: 120 }
];



const playerSizes = [
  { text: "Small", value: "small" },
  { text: "Medium", value: "medium" },
  { text: "Large", value: "large" }
];

// const pacings = [
//   { text: "ASAP", value: "asap" },
//   { text: "Even", value: "even" }
// ];


class FlightTargetings extends Component {
  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });
  };

  handleCheckbox = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: !data.checked });
    if (data.name === "isVastOnly" && !data.checked) {
      this.props.changeFlight({ prop: 'isUnmutedOnly', value: false });
      this.props.changeFlight({ prop: 'isVisibleOnly', value: false });
    }
  };

  handleChange = (event) => {
    this.props.changeFlight({ prop: event.target.name, value: event.target.value });
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

  render() {
    const { checkboxStyle } = styles;
    const { format, isVisibleOnly, isUnmutedOnly, activeUser,  playerSize, errorPlayerSize, maxVideoDuration, errorMaxVideoDuration, isVastOnly, pacing, errorPacing, cap, errorCap, capsErrors } = this.props;

    return (
      <div >
      <div className='form'>
        <div className='form__myhalf'>
            {format =='video' ? <div>
            <div className='form__inside' >
               <div className='float-container'>
                {playerSize.length ? <label className={classNames('bwa-select-label', { 'bwa-floated': playerSize.length })} >Player Size</label> : <label> </label>}
                <Select multiple placeholder="Player Size" value={playerSize ? playerSize : ['']} fluid options={playerSizes} name="playerSize" value={playerSize} onChange={this.handleSelect} error={errorPlayerSize} />
              </div>
            </div>

            <div className='form__inside' >
               <div className='float-container'>
                <label className='bwa-select-label bwa-floated' >Max. Video Duration</label>
                <Select placeholder="Max. Video Duration" value={maxVideoDuration ? maxVideoDuration : 0} fluid options={videoDuration} name="maxVideoDuration" onChange={this.handleSelect} error={errorMaxVideoDuration} />
              </div>
            </div>
            {/* {!isVastOnly ? <div className='form__inside' ><Checkbox checked={isVisibleOnly} label="Only Visible" style={checkboxStyle} name="isVisibleOnly" onClick={this.handleCheckbox} /></div> : null}
            {!isVastOnly ? <div className='form__inside' > <Checkbox checked={isUnmutedOnly} label="Only Unmuted" style={checkboxStyle} name="isUnmutedOnly" onClick={this.handleCheckbox} /></div> : null} */}
          </div>:null}

        
          <div className='form__inside'>
             <div className='float-container'>
              {cap ? <label className={classNames('bwa-floating-label', { 'bwa-floated': cap })} >Frequency of Opportunity (per 24 hours)</label> : <div style={{marginTop:'8px'}}></div>}
              <Input fluid placeholder="Frequency of Opportunity (per 24 hours)" type="text" name="cap" value={cap} onChange={this.handleChange} error={errorCap} />
            </div>
          </div>
          < FlightUserAgent/>
              <FlightCompliance />
              <FlightGeo />
        </div>
        <div className='form__myhalf'>
                <FlightTargeting />
                <FlightParting/>
        </div>
        <div className='form__error' > 
                  {capsErrors.length ? <h5> There are some errors with your submission</h5> : null}
                  {capsErrors.length ? (capsErrors.map((err, index)=>{
           return <Alert key={index} color='danger'> {err}</Alert>
         })):(null)}


        </div>
      </div>
      <br/>
</div>
    )
  }
}

const styles = {
  checkStyle: {
    paddingTop: "2px"
  },
  accStyle: {
    marginTop: "1px"
  },
  contentStyle: {
    paddingBottom: "10px",
    paddingLeft: "20px"
  },
  listStyle: {
    display: "block",
    marginLeft: "7px",
    marginBottom: "3px"
  },
  checkboxStyle: {
    paddingTop: "7px"
  },
  rightStyle: {
    paddingRight: "0"
  },
  segmentStyle: {
    overflowY: "scroll",
    height: "300px"
  },
  padStyle: {
    paddingBottom: "0"
  },
  renderCheckboxStyle: {
    paddingTop: "7px",
    marginRight: "6px",
    marginLeft: "12px"
  }
};

const mapStateToProps = state => {
  const {format, isVisibleOnly, isUnmutedOnly, playerSize, errorPlayerSize, maxVideoDuration, errorMaxVideoDuration, isVastOnly,  pacing, errorPacing, cap, errorCap, capsErrors, dayParting } = state.flight;
  const { activeUser } = state.shared;
  return {activeUser, format, isVisibleOnly, isUnmutedOnly, playerSize, errorPlayerSize, maxVideoDuration, errorMaxVideoDuration, isVastOnly,  pacing, errorPacing, cap, errorCap, capsErrors, dayParting };
};

export default connect(mapStateToProps, { changeFlight })(FlightTargetings);
