import React, { Component } from 'react';
import { Select, Input, TextArea, Button, Checkbox, Icon} from 'semantic-ui-react';
import classNames from 'classnames';
import { changeFlight, listFlightCampaigns } from '../../redux/actions/flight.actions';
import {Alert } from 'reactstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router';
import API from "../../utils/API";
import FlightType from './flight.detailsType';
import FlightGoals from './flight.detailsGoals';
import { ROLE_OPSADMIN, ROLE_SUPERADMIN } from "../../roles";

const displaySizes = [
  { text: "728x90", value: "728x90" },
  { text: "160x600", value: "160x600" },
  { text: "300x250", value: "300x250" },
  { text: "300x600", value: "300x600" },
  { text: "300x50", value: "300x50" },
  { text: "320x50", value: "320x50" },
  { text: "768x1024", value: "768x1024" },
  { text: "1024x768", value: "1024x768" },
  { text: "Custom", value: "custom" }
];

const timeZones = [
  { text: "US/Pacific", value: "US/Pacific" },
  { text: "US/Eastern", value: "US/Eastern" },
  { text: "UTC", value: "UTC" }
];
const formats = [
  { text: "Video", value: "video" },
  { text: "Display", value: "display" }
];

const channels = [
  { text: "Desktop", value: "desktop" },
  { text: "Mobile Web", value: "mobile_web" },
  { text: "Mobile App", value: "mobile_app" },
  { text: "CTV", value: "ctv" }
];

/* take a look at the flight status form 
 further down the page - 
 we want this selector to display statuses
 that cannot be altered by a user, but are
 otherwise important for them to know about.
 We'll want to add a tooltip on the view for this
 that indicates what each of the statuses mean.
*/
const statuses = [
  { text: "Active", value: "active" },
  { text: "Inactive", value: "inactive", disabled: true },
  { text: "Paused", value: "paused" },
  { text: "Disabled", value: "disabled" },
  { text: "Complete", value: "complete", disabled: true },
  { text: "Capped", value: "capped", disabled: true }
];


class FlightDetails extends Component {
  state = {
    campaign: []

  };

  componentWillMount() {
    const { activeUser } = this.props;
    this.props.changeFlight({ prop: 'startTime', value: moment().format('HH:mm') });
    this.props.changeFlight({ prop: 'startDate', value: moment().format('YYYY-MM-DD') });
    this.props.changeFlight({ prop: 'timezone', value: activeUser.user.timezone });
    if (this.props.campaignId) { this.handleDate(this.props.campaignId) };

  }
  // handles campaign date for checking with flight range
  handleDate = (value) => {
    API.getDates(value)
      .then(res => {
        let endTime = moment.unix(res.data.end_time).format("YYYY-MM-DD");
        let startTime = moment.unix(res.data.start_time).format("YYYY-MM-DD");
        localStorage.setItem('endTime', endTime);
        localStorage.setItem('startTime', startTime);
      })
      .catch(err => console.log(err));
  }
  handleDisplaySize =(event, data)=>{
    this.props.changeFlight({ prop: data.name, value: data.value });
    if (data.name === "displaySize" && data.value !== "custom") {
      let sizes = data.value.split('x');
      this.props.changeFlight({ prop: 'width', value: Number(sizes[0]) });
      this.props.changeFlight({ prop: 'height', value: Number(sizes[1]) });
    }
  }

  handleSelect = (event, data) => {
    this.props.changeFlight({ prop: data.name, value: data.value });

    if (data.name === 'advertiserId') {
      this.props.listFlightCampaigns(data.value);
      this.props.changeFlight({ prop: 'campaignId', value: 0 })
    }
    else if (data.name === 'campaignId') {
      console.log(data.value);
      this.handleDate(data.value);
    }

  };

  handleVast = (event, data) => {
    event.preventDefault();
    if (data.name =='vast') {
      this.props.changeFlight({ prop: 'isVastOnly', value: true}); 
    } else {
      this.props.changeFlight({ prop: 'isVastOnly', value: false });
    }
    if (data.name === "isVastOnly" && !data.checked) {
      this.props.changeFlight({ prop: 'isUnmutedOnly', value: false });
      this.props.changeFlight({ prop: 'isVisibleOnly', value: false });
    }
  };
  handleFlightType = (event) => {
    event.preventDefault();
    // if (this.props.match.params.status !== "update") {
      this.props.changeFlight({ prop: 'flight_type', value: event.target.value });
      this.props.changeFlight({ prop: 'videoValid', value: false });
      this.props.changeFlight({ prop: 'displayValid', value: false });
      if (event.target.value !== 'standard') {
        this.props.changeFlight({ prop: 'party', value: 'rtb' });
        this.props.changeFlight({ prop: 'videoValid', value: true });
        this.props.changeFlight({ prop: 'displayValid', value: true});
      }
    // }   
  };

  handleChange = (event) => {
    event.preventDefault();
    if (event.target.name =='inactive') {
      return;
    }
    this.props.changeFlight({ prop: event.target.name, value: event.target.value });
  };

  render() {
    const { dropdownStyle, checkboxStyle, widthStyle } = styles;
    const { channel, activeUser, errorHeight, errorWidth, width, height, errorDisplaySize,  displaySize, isVastOnly, errorChannel, format, errorFormat, advertiserId, flight_type, match, advertisers, errorAdvertiserId, campaignId, campaigns, errorCampaignId, name, errorName, notes, errorNotes, startDate, errorStartDate, startTime, endDate, errorEndDate, endTime, timezone, status, detailsErrors, capsErrors, typeErrors, goalsErrors } = this.props;

    return (
      <form className='form'>
        <div className='form__myhalf'>
          <div className='form__inside' >
            
            <div className='float-container'>
              {advertiserId ? <label className={classNames('bwa-select-label', { 'bwa-floated': advertiserId })} >Advertiser Name</label> : <label> </label>}
              <Select disabled={match.params.status === "update"} placeholder="Advertiser Name" value={advertiserId ? advertiserId : ''} selection search fluid name="advertiserId" options={advertisers} onChange={this.handleSelect} error={errorAdvertiserId} />
            </div>
          </div>
          <div className='form__inside' >
             <div className='float-container'>
              {campaignId ? <label className={classNames('bwa-select-label', { 'bwa-floated': campaignId })} >Campaign Name</label>:<label> </label>}
              <Select placeholder="Campaign Name" search disabled={match.params.status === "update"} value={campaignId ? campaignId:''} fluid name="campaignId" id="campaignId" options={campaigns} onChange={this.handleSelect} error={errorCampaignId} />
            </div>
          </div>
          <div className='form__inside' >
               <div className='float-container'>
             {name? <label className={classNames('bwa-floating-label', { 'bwa-floated': name })} >Flight Name</label>:<label> </label>}
              <Input fluid placeholder="Flight Name" type="text" name="name" value={name} onChange={this.handleChange} error={errorName} />
            </div>
          </div>
          <div className='form__inside' >
             <div className='float-container' style={{marginTop:'5px'}}>
              {notes ? <label className={classNames('bwa-floating-label', { 'bwa-floated': notes })}>Notes</label>:<div style={{marginTop:'10px'}}> </div>}
              <TextArea rows={5} placeholder='Notes' name="notes" rows='3' value={notes} onChange={this.handleChange}/>
            </div>
          </div>
          <div className='form__inside'>
             <div className='float-container'  style={{marginRight:"15px", marginTop:'8px'}} >
             <span className='select-color'> Flight Type &nbsp; </span>
             <Button.Group size='mini'>
    <Button onClick={this.handleFlightType} name='standard' value='standard' className={classNames({ 'active-flight-type': flight_type =='standard' })} >Standard</Button>
    <Button onClick={this.handleFlightType} name='rtb' value='rtb' className={classNames({ 'active-flight-type': flight_type =='rtb' })} >RTB</Button>
    <Button onClick={this.handleFlightType} name='deal_id' value='deal_id' className={classNames({ 'active-flight-type': flight_type =='deal_id' })} >Deal ID</Button>
  </Button.Group>
  </div>

  </div>
  <div className='form__inside' >
<div className='float-container'>
 {channel ? <label className={classNames('bwa-select-label', { 'bwa-floated': channel })} >Channel</label> : <label> </label>}
 <Select placeholder="Channel" value={channel ? channel : ''} selection search fluid name="channel" options={channels} onChange={this.handleSelect} error={errorChannel} />
</div>
</div>
<div className='form__inside' >
<div className='float-container'>
 {format ? <label className={classNames('bwa-select-label', { 'bwa-floated': format })} >Format</label> : <label> </label>}
 <Select placeholder="Format" value={format ? format : ''} fluid name="format" id="format" options={formats} onChange={this.handleSelect} error={errorFormat} />
</div>
</div>
{(flight_type === "rtb" || flight_type === "deal_id" ) && format === "display" ? <div className='form__inside' >
               <div className='float-container'>
                {displaySize ? <label className={classNames('bwa-select-label', { 'bwa-floated': displaySize })} >Display Size</label> : <div style={{marginTop:'8px'}}> </div>}
                <Select placeholder="Display Size" value={displaySize ? displaySize : ''} selection search fluid name="displaySize" options={displaySizes} onChange={this.handleDisplaySize} error={errorDisplaySize} />
              </div>
            </div> : null}
            {/* {displaySize === "custom" ? <div className='form__inside' >
               <div className='float-container'>
                {width ? <label className={classNames('bwa-floating-label', { 'bwa-floated': width })} >Display width (pixels)</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Display width (pixels)" type="text" name="width" value={width} onChange={this.handleSelect} error={errorWidth} />
              </div>
            </div> : null} */}
            {/* {displaySize === "custom" ? <div className='form__inside' >
               <div className='float-container'>
                {height ? <label className={classNames('bwa-floating-label', { 'bwa-floated': height })} >Display height (pixels)</label> : <div style={{marginTop:'8px'}}> </div>}
                <Input fluid placeholder="Display height (pixels)" type="text" name="height" value={height} onChange={this.handleSelect} error={errorHeight} />
              </div>
            </div> : null} */}
       { format =='video' ? <div className='form__inside' style={{marginTop:'10px'}} >  <div className='float-container' > <span className='select-color'> VPAID Type &nbsp; </span><Button.Group size='tiny'>
             <Button onClick={this.handleVast}  name='vpaid' value='vpaid' className={classNames({'active-flight-type':!isVastOnly})}  >{!isVastOnly ? <Icon name="check" />:null}Vpaid</Button>
             <Button onClick={this.handleVast}  name='vast' value='vast'  className={classNames({'active-flight-type':isVastOnly})} >{isVastOnly ?<Icon name="check" />:null} Vast</Button>
           </Button.Group></div>   
           </div> :null}   
                 </div>
        <div className='form__myhalf'>
        <div className='form__inside' >
             <div className='float-container'>
              <label className='bwa-select-label bwa-floated'>Time Zone</label>
              <Select label="Time Zone" value={timezone} style={dropdownStyle} selection fluid name="timezone" options={timeZones} onChange={this.handleSelect} />
            </div>
          </div>
        <div className='form__inside_flex'>
            <div className='form__half' >
              <div className='float-container'>
                <label  className='bwa-floating-label bwa-floated'>Start Date</label>
                <Input fluid name="startDate" type="date" value={startDate} onChange={this.handleChange} error={errorStartDate} />
              </div>
            </div>

            <div className='form__half' >
               <div className='float-container'>
                <label className='bwa-floating-label bwa-floated'>Start Time</label>
                <Input fluid name="startTime" type="time" value={startTime} onChange={this.handleChange}/>
              </div>
            </div>

          </div>

          <div className='form__inside_flex' >
            <div className='form__half' >
               <div className='float-container'>
                <label className='bwa-floating-label bwa-floated'>End Date</label>
                <Input fluid type="date" name="endDate" value={endDate} onChange={this.handleChange} error={errorEndDate}/>
              </div>
            </div>

            <div className='form__half' >
               <div className='float-container'>
                <label className='bwa-floating-label bwa-floated'>End Time</label>
                <Input fluid type="time" name="endTime" value={endTime?endTime:'23:59'}  onChange={this.handleChange}/>
              </div>
            </div>
          </div>
          <div className='form__half' >
               <div className='float-container' style={{marginRight:"15px", marginTop:'8px'}} >
               <span className='select-color'> Status &nbsp; </span>
          <Button.Group size='mini' style={{marginTop:'10px'}}>
             <Button onClick={this.handleChange} name='status' value='active'  className={classNames({ 'active-flight-type': status =='active' })} >{status =='active' ? <Icon name="check" />:null}Active</Button>
             <Button onClick={this.handleChange} name='inactive' value='inactive'  className={classNames({ 'active-flight-type': status !=='active' })}>{status !=='active' ? <Icon name="check" />:null}Inactive</Button>
           </Button.Group>
           </div>
           </div>
        <FlightType/>
        <FlightGoals />
        </div>
        <div className='form__error'> 
                  {detailsErrors.length ||capsErrors.length || typeErrors.length ? <h5> There are some errors with your submission</h5> : null}
         {detailsErrors.length ? (detailsErrors.map((err, index)=>{
           return <Alert key={index} color='danger'> {err}</Alert>
         })):(null)}
        
        {typeErrors.length ? (typeErrors.map((err, index)=>{
           return <Alert key={index} color='danger'> {err}</Alert>
         })):(null)}

         {goalsErrors.length ? (goalsErrors.map((err, index)=>{
           return <Alert key={index} color='danger'> {err}</Alert>
         })):(null)}

         

        </div>
      </form>
    )
  }
}


const styles = {
  dropdownStyle: {
    marginBottom: "10px"
  },
  checkboxStyle: {
    paddingTop: "7px"
  },
  widthStyle: {
    width: "100% !important"
  }
};

export const mapStateToProps = state => {
  const {
    advertiserId, advertisers, errorAdvertiserId, campaignId, campaigns,
    errorCampaignId, name, errorName, notes, errorNotes, startDate,
    errorStartDate, startTime, endDate, errorEndDate, endTime, channel, errorChannel, format, errorFormat, width, height,
    timezone, status, detailsErrors, flight_type, capsErrors, typeErrors, goalsErrors, isVastOnly, displaySize, errorDisplaySize  } = state.flight;
  const { email } = state.auth;
  const { activeUser } = state.shared;

  return {
    advertiserId, advertisers, errorAdvertiserId, campaignId, campaigns, errorCampaignId, width, height,
    name, errorName, notes, errorNotes, startDate, errorStartDate, startTime, endDate, channel, errorChannel, format, errorFormat,
    errorEndDate, endTime, timezone, status, detailsErrors, activeUser, email, flight_type, capsErrors, typeErrors, goalsErrors, isVastOnly, displaySize, errorDisplaySize 
  };
};

export default withRouter(connect(mapStateToProps, { changeFlight, listFlightCampaigns })(FlightDetails));
